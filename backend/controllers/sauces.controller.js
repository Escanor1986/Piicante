const colors = require("colors");
// On récupère d'abord le modèle des sauces depuis son module
const Sauce = require("../models/sauces.models");
// On initialise filesystem "fs" afin de préparer l'utilisation de fichier
// notamment pour la suppression et le remplacement d'image dans les modifications de la sauce
const fs = require("fs");

// Concernant la récupération de TOUTES les sauces *****************************************************
// *****************************************************************************************************
// Seule la personne identifiée avec son token aura accès SA/SES sauce(s) !
exports.getAllSauce = (req, res, next) => {
  // on utilise "find()" pour retrouver toutes les sauces
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces)) // retour positif avec un status 200 et la réponse en json
    .catch((error) => res.status(400).json(colors.red({ error }))); // Capture de l'erreur pour éviter de faire crasher le serveur
};

// Concernant la récupération d'une SEULE sauce ********************************************************
// *****************************************************************************************************
// Seule la personne identifiée avec son token aura accès SA/SES sauce(s) !
exports.getOneSauce = (req, res, next) => {
  // on va rechercher l'utlisateur concerné via l'id mongoose créé sur base du modèle dans models
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces)) // retour positif avec un status 200 et la réponse en json
    .catch((error) => res.status(400).json(colors.red({ error }))); // Capture de l'erreur pour éviter de faire crasher le serveur
};

// Concernant la CREATION d'une sauce ******************************************************************
// *****************************************************************************************************
// Création de la sauce par un utilisateur
exports.createSauce = (req, res, next) => {
  // On parse le JSON du body de la requête sauce pour en récupérer le contenu
  // confer https://www.geeksforgeeks.org/node-js-url-parseurlstring-parsequerystring-slashesdenotehost-api/
  const newSauceObject = JSON.parse(req.body.sauce);
  // On vérifieque l'id de l'utilisateur EST LE MÊME que celui correspondant au TOKEN !
  if (newSauceObject.userId !== req.auth.userId) {
    // si l'utilisateur n'est pas autorisé, on lui renvoie une status 403
    return res.status(403).json(colors.red("⛔ Requête non autorisée ! ⛔"));
    // On vérifie que le fichier posté est une image reprise dans les formats ci dessous
  } else {
    const sauce = new Sauce({
      // création d'une nouvelle instance de sauce sur base du modèle exporté depuis models
      // Utilisation de l'opérateur spread pour ajouter les propriétés manquantes à l'objets depuis "req.body"
      ...newSauceObject,
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      userDisliked: [],
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    sauce
      // on fait un save() pour enregistrer la sauce dans la base données mongoDB
      .save()
      // On génère une promesse suite à la sauvegarde
      .then(() => {
        res
          .status(201) // si la sauce est générée avec succès, on renvoie un status 201 (created)
          .json(colors.blue({ message: "Nouvelle sauce créée avec succès !" }));
      }) // Dans le cas contraire, Capture de l'erreur pour éviter de faire crasher le serveur
      .catch((error) => {
        res.status(400).json(colors.red({ error }));
      });
  }
};

// Concernant la SUPPRESSION d'une sauce **************************************************************
// *****************************************************************************************************
exports.deleteSauce = (req, res, next) => {
  // si erreur status 400 400 Bad Request et erreur en json

  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      // On vérifie que l'id de l'utilisateur EST LE MÊME que celui correspondant au TOKEN !
      if (sauce.userId !== req.auth.userId) {
        // si l'utilisateur n'est pas autorisé, on lui renvoie une status 403
        return res.status(403).json(colors.red("⛔ Requête non autorisée ! ⛔"));
        // si il y a bien un fichier ("file") image avec la tentative de modification
      } else {
        // Localisation et sélection de l'image à supprimer (elle est séparée de son objet initiale avec .split)
        // confer https://www.geeksforgeeks.org/node-js-split-function/
        const fileName = sauce.imageUrl.split("/images/")[1];
        // Suppression du fichier image voué à être remplacer avec "fs.unlink"
        // confer https://www.geeksforgeeks.org/node-js-fs-unlink-method/
        fs.unlink(`images/${fileName}`, () => {
          // Suppression de la sauce dans la base de données mongoDB
          Sauce.deleteOne({ _id: req.params.id })
            .then(() =>
              res
                .status(200)
                .json(colors.blue({ message: "Sauce supprimée avec succès !" }))
            )
            .catch((error) => res.status(400).json(colors.red({ error })));
        });
      }
    })
    .catch((error) => res.status(500).json(colors.red({ error })));
};

// Concernant la MODIFICATION d'une sauce **************************************************************
// *****************************************************************************************************
exports.modifySauce = (req, res, next) => {
  // on va rechercher l'utlisateur concerné via l'id mongoose
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    // variable qui contient les propriétés ne pouvant être modifiés lors de la modification
    // d'une sauce par son utilisateur identifié préalablement par son TOKEN avec son userId
    const unModifedProperties = {
      userId: req.auth.userId,
      likes: sauce.likes,
      dislikes: sauce.dislikes,
      usersLiked: sauce.usersLiked,
      usersDisliked: sauce.usersDisliked,
    };
    // On vérifie que l'id de l'utilisateur EST LE MÊME que celui correspondant au TOKEN !
    if (sauce.userId !== req.auth.userId) {
      // si l'utilisateur n'est pas autorisé, on lui renvoie une status 403
      return res.status(403).json(colors.red("⛔ Requête non autorisée ! ⛔"));
      // si il y a bien un fichier ("file") image avec la tentative de modification
    } else {
      // Localisation et sélection de l'image à remplacer (elle est séparée de son objet initiale avec .split)
      // confer https://www.geeksforgeeks.org/node-js-split-function/
      const imageName = sauce.imageUrl.split("/images/")[1];
      // Suppression du fichier image voué à être remplacer avec "fs.unlink"
      // confer https://www.geeksforgeeks.org/node-js-fs-unlink-method/
      fs.unlink(`images/${imageName}`, () => {
        // Vérification de la présence d'un fichier au sein de la requête
        const sauceObject = req.file // littéralement si req.file est TRUE
          ? // SI sauceObject = req.file... ALORS...
            {
              // Utilisation de l'opérateur spread pour ajouter les propriétés manquantes à l'objets depuis "req.body"
              ...JSON.parse(req.body.sauce),
              // Ajout de l'image
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`, // On reprend unModifedProperties pour finaliser la construction de notre
              // nouvel objet en devenir
              ...unModifedProperties,
            } // littéralement si req.file est FALSE
          : // SI sauceObject != req.file ==> on récupère l'image d'origine du body
            { ...req.body };
        // Modification de la sauce dans la base données
        Sauce.updateOne(
          // ce premier argument c'est l'id correspondant à l'objet de la requête
          { _id: req.params.id },
          // Concernant le deuxième argument, c'est la nouvelle version de l'objet créé avec l'opérateur SPREAD

          { ...sauceObject, _id: req.params.id }
        )
          .then(() =>
            res
              .status(201) // statut 201 created
              .json(
                colors.blue({
                  message: "Votre sauce a été modifiée avec succès !",
                })
              )
          )
          // Capture de l'erreur pour éviter de faire crasher le serveur
          .catch((error) => res.status(400).json(colors.red({ error })));
      });
    }
  });
};

// Concernant les LIKES & DISLIKES d'une sauce **************************************************************
// *****************************************************************************************************
exports.likeSauce = (req, res, next) => {
  // Utilisation du modèle Mongoose avec la méthode findOne pour récupérer par comparaison req.params.id
  Sauce.findOne({ _id: req.params.id });
  // Déclaration/initialisation des variables pour le SWITCH
  // on récupère l'id de la sauce
  const sauceId = req.params.id;
  // on récupère l'id du user votant
  const userId = req.body.userId;
  // on récupère la valeur du like sur laquelle on vatravailler avec le switch
  const like = req.body.like;

  switch (like) {
    // Premier cas, l'utilisateur like la sauce...
    case 1:
      // Update de la sauce
      Sauce.updateOne(
        { _id: sauceId },
        {
          // L'opérateur "$inc" permet d'incrémenter un champ avec une valeur spécifique
          // Celle-ci peut-être positive ou négat, si le champ n'existe pas, il est créée
          // attention à ne pas l'utiliser avec une valeur, cela provoquerait une erreur
          $inc: { likes: 1 }, // on augmente les likes de 1
          // L'opérateur "$push" ajouet une valeur spécifique (ici obtenue avec $inc) dans un tableau
          // Le champ doit être un tableau, si le champs est absent du tableau à incrémenter,
          // l'opérateur $push ajoute le champ du tableau avec la valeur comme élément
          $push: { usersLiked: userId }, // on ajoute cette nouvelle valeur au tableau
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
      // On passe au cas suivant si l'utilisateur n'a pas liké
      break;
    // Second cas, l'utilisateur dislike la sauce...
    case -1:
      // Update de la sauce
      Sauce.updateOne(
        { _id: sauceId },
        {
          // L'opérateur "$inc" permet d'incrémenter un champ avec une valeur spécifique
          // Celle-ci peut-être positive ou négat, si le champ n'existe pas, il est créée
          // attention à ne pas l'utiliser avec une valeur, cela provoquerait une erreur
          $inc: { dislikes: 1 }, // on augmente les dislikes de 1
          // L'opérateur "$push" ajouet une valeur spécifique (ici obtenue avec $inc) dans un tableau
          // Le champ doit être un tableau, si le champs est absent du tableau à incrémenter,
          // l'opérateur $push ajoute le champ du tableau avec la valeur comme élément
          $push: { usersDisliked: userId }, // on ajoute cette nouvelle valeur au tableau
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
      // On passe au cas suivant si l'utilisateur n'a pas disliké
      break;
    // Troisième et dernier cas, l'utilisateur retire son like ou son dislike
    case 0:
      Sauce.findById({ _id: sauceId })
        .then((sauce) => {
          // l'utilisateur retire son like
          if (sauce.usersLiked.includes(userId)) {
            // Update de la sauce
            Sauce.updateOne(
              { _id: sauceId },
              {
                // L'opérateur "$inc" permet d'incrémenter un champ avec une valeur spécifique
                // Celle-ci peut-être positive ou négative, si le champ n'existe pas, il est créée
                // attention à ne pas l'utiliser avec une valeur, cela provoquerait une erreur
                $inc: { likes: -1 }, // on décrémente les likes de 1
                // L'opérateur "$push" ajouet une valeur spécifique (ici obtenue avec $inc) dans un tableau
                // Le champ doit être un tableau, si le champs est absent du tableau à incrémenter,
                // l'opérateur $push ajoute le champ du tableau avec la valeur comme élément
                $pull: { usersLiked: userId }, // on ajoute cette nouvelle valeur au tableau
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
          // l'utilsateur retire son dislike
          if (sauce.usersDisliked.includes(userId)) {
            // Update de la sauce
            Sauce.updateOne(
              { _id: sauceId },
              {
                // L'opérateur "$inc" permet d'incrémenter un champ avec une valeur spécifique
                // Celle-ci peut-être positive ou négative, si le champ n'existe pas, il est créée
                // attention à ne pas l'utiliser avec une valeur, cela provoquerait une erreur
                $inc: { dislikes: -1 }, // ond écrémente les dislikes de 1
                // L'opérateur "$push" ajouet une valeur spécifique (ici obtenue avec $inc) dans un tableau
                // Le champ doit être un tableau, si le champs est absent du tableau à incrémenter,
                // l'opérateur $push ajoute le champ du tableau avec la valeur comme élément
                $pull: { usersDisliked: userId }, // on ajoute cette nouvelle valeur au tableau
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
      // on arrive au bout de la chaine du switch
      break;
  }
};
