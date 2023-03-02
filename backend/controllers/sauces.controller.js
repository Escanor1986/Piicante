const path = require("path");
const colors = require("colors");
const Sauce = require("../models/sauces.models");
const fs = require("fs");
// Utilisation de la bibliothèque sanitize-html pour nettoyer les entrées utilisateur et éviter les attaques XSS(Cross-Site Scripting).
const sanitizeHtml = require("sanitize-html");

const rainbowify = (string) => {
  // codes de couleur ANSI pour les couleurs de l'arc-en-ciel (rouge, jaune, vert, bleu, violet et cyan).
  const colors = [
    "\x1b[31m",
    "\x1b[33m",
    "\x1b[32m",
    "\x1b[34m",
    "\x1b[35m",
    "\x1b[36m",
  ];
  let rainbowString = "";
  // parcourt chaque caractère de la chaîne de caractères en utilisant une boucle for et ajoute
  // à chaque fois le code de couleur correspondant à la position du caractère dans le tableau colors.
  for (let i = 0; i < string.length; i++) {
    rainbowString += colors[i % colors.length] + string[i];
  }
  return rainbowString;
};

// Concernant la récupération de TOUTES les sauces *****************************************************
// *****************************************************************************************************

exports.getAllSauce = async (req, res, next) => {
  try {
    const sauces = await Sauce.find();
    res.status(200).json(sauces);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur serveur lors de la récupération des sauces" });
  }
};

// Concernant la récupération d'une SEULE sauce ********************************************************
// *****************************************************************************************************

exports.getOneSauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findById(req.params.id);
    if (!sauce) {
      return res.status(404).json({ error: "Sauce non trouvée" });
    }
    return res.status(200).json(sauce);
  } catch (error) {
    return res.status(500).json({ error: "Impossible de récupérer la sauce" });
  }
};

// Concernant la CREATION d'une sauce ******************************************************************
// *****************************************************************************************************

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);

  // Vérification que tous les champs obligatoires sont renseignés
  if (
    !sauceObject.name ||
    !sauceObject.manufacturer ||
    !sauceObject.description ||
    !sauceObject.mainPepper ||
    !sauceObject.heat ||
    !req.file
  ) {
    return res
      .status(400)
      .json({ error: rainbowify("Tous les champs doivent être renseignés") });
  }

  const sauce = new Sauce({
    name: sanitizeHtml(sauceObject.name),
    manufacturer: sanitizeHtml(sauceObject.manufacturer),
    description: sanitizeHtml(sauceObject.description),
    mainPepper: sanitizeHtml(sauceObject.mainPepper),
    heat: sanitizeHtml(sauceObject.heat),
    likes: 0,
    dislikes: 0,
    usersLiked: [],
    userDisliked: [],
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    userId: req.auth.userId,
  });

  // Enregistrement de la nouvelle sauce
  sauce
    .save()
    .then(() => {
      res
        .status(201)
        .json({ message: rainbowify("Nouvelle sauce créée avec succès !") });
    })
    .catch((error) => {
      res.status(500).json({ error: error });
    });
};

// Concernant la SUPPRESSION d'une sauce **************************************************************
// *****************************************************************************************************

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({ error: "Sauce non trouvée" });
      }
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({ error: "Requête non autorisée !" });
      }
      const fileName = sauce.imageUrl.split("/images/")[1];
      fs.promises
        .unlink(`images/${fileName}`)
        .then(() => {
          return Sauce.deleteOne({ _id: req.params.id });
        })
        .then(() => {
          res.status(200).json({ message: "Sauce supprimée avec succès !" });
        })
        .catch((error) => {
          res.status(500).json({ error: error.message });
        });
    })
    .catch((error) => res.status(500).json({ error: error.message }));
};

// Concernant la MODIFICATION d'une sauce **************************************************************
// *****************************************************************************************************

exports.modifySauce = async (req, res, next) => {
  try {
    const sauce = await Sauce.findById(req.params.id);
    if (!sauce) {
      return res.status(404).json({ message: "Sauce introuvable" });
    }
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json({ message: "Requête non autorisée !" });
    }

    // Si une nouvelle image est ajoutée à la requête, supprime l'ancienne image de la sauce
    if (req.file) {
      const oldFilename = sauce.imageUrl.split("/images/")[1];
      await fs.promises.unlink(`images/${oldFilename}`);
    }

    // Crée un objet qui contient les champs à mettre à jour pour la sauce
    const sauceObject = req.file
      ? {
          // Si un fichier est envoyé avec la requête, on crée un nouvel objet avec les champs existants de la sauce
          ...JSON.parse(req.body.sauce), // On récupère les champs de la sauce existante
          imageUrl: `${req.protocol}://${req.get("host")}/images/${
            // On ajoute le chemin complet vers l'image téléchargée
            req.file.filename
          }`,
          userId: req.auth.userId,
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        }
      : {
          // Si aucun fichier n'est envoyé avec la requête, on crée un nouvel objet avec les champs envoyés dans la requête
          ...req.body,
          userId: req.auth.userId,
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        };

    await Sauce.updateOne({ _id: req.params.id }, sauceObject);
    return res.status(200).json({ message: "Sauce modifiée !" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Concernant les LIKES & DISLIKES d'une sauce **************************************************************
// *****************************************************************************************************

exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id });
  const sauceId = req.params.id;
  const userId = req.body.userId;
  const like = req.body.like;

  switch (like) {
    // Premier cas, l'utilisateur like la sauce...
    case 1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { likes: 1 },
          $push: { usersLiked: userId },
        }
      )
        .then(() =>
          res.status(200).json(
            colors.blue({
              message: "Vous avez aimé la sauce !",
            })
          )
        )
        .catch((error) => res.status(400).json(colors.red({ error })));

      break;
    // Second cas, l'utilisateur dislike la sauce...
    case -1:
      Sauce.updateOne(
        { _id: sauceId },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
        }
      )
        .then(() =>
          res.status(200).json(
            colors.blue({
              message: "Vous n'avez pas aimé la sauce !",
            })
          )
        )
        .catch((error) => res.status(400).json(colors.red({ error })));
      break;
    // Troisième et dernier cas, l'utilisateur retire son like ou son dislike
    case 0:
      Sauce.findById({ _id: sauceId })
        .then((sauce) => {
          if (sauce.usersLiked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId },
              }
            )
              .then(() =>
                res.status(200).json(
                  colors.blue({
                    message: "Vous n'aimez plus la sauce !",
                  })
                )
              )
              .catch((error) => res.status(400).json(colors.red({ error })));
          }
          if (sauce.usersDisliked.includes(userId)) {
            Sauce.updateOne(
              { _id: sauceId },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: userId },
              }
            )
              .then(() =>
                res.status(200).json(
                  colors.blue({
                    message: "Vous ne détestez plus la sauce !",
                  })
                )
              )
              .catch((error) => res.status(400).json(colors.red({ error })));
          }
        })
        .catch((error) => res.status(400).json(colors.red({ error })));

      break;
  }
};
