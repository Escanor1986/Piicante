// On récupère d'abord le modèle des sauces depuis son module
const Sauce = require("../models/sauces.models");
// On initialise filesystem "fs" afin de préparer l'utilisation de fichier
const fs = require("fs");

// Concernant la récupération de TOUTES les sauces *****************************************************
// *****************************************************************************************************
// Seule la personne identifiée avec son token aura accès SA/SES sauce(s) !
exports.getAllSauce = (req, res, next) => {
  // on utilise "find()" pour retrouver toutes les sauces
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces)) // retour positif avec un status 200 et la réponse en json
    .catch((error) => res.status(400).json({ error })); // retour négatif avec une erreure en json et un statut 400
};

// Concernant la récupération d'une SEULE sauce ********************************************************
// *****************************************************************************************************
// Seule la personne identifiée avec son token aura accès SA/SES sauce(s) !
exports.getOneSauce = (req, res, next) => {
  // on va rechercher l'utlisateur concerné via l'id mongoose créé sur base du modèle dans models
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces)) // retour positif avec un status 200 et la réponse en json
    .catch((error) => res.status(400).json({ error })); // retour négatif avec une erreure en json et un statut 400
};

// Concernant la CREATION d'une sauce ******************************************************************
// *****************************************************************************************************
// Création de la sauce par un utilisateur
exports.createSauce = (req, res, next) => {
  // On parse le JSON du body de la requête sauce pour en récupérer le contenu
  const newSauceObject = JSON.parse(req.body.sauce);
  // On vérifie également que l'id d el'utilisateur EST LE MÊME que celui correspondant au TOKEN !
  if (newSauceObject.userId !== req.auth.userId) {
    // si l'utilisateur n'est pas autorisé, on lui renvoie une status 403
    return res.status(403).json("Requête non autorisée !");
    // ensuite on vérifie que le fichier envoyé correspond au format de fichier autorisé
  } else {
    const sauce = new Sauce({
      // création d'une nouvelle instance de sauce sur base du modèle exporté depuis models
      ...newSauceObject, // Utilisation de l'opérateur spread pour ajouter les propriétés manquantes à l'objets depuis "req.body"
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      userDisliked: [],
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
    });
    if (sauce.heat < 0 || sauce.heat >= 10) {
      sauce.heat = 0; // vérification d'un encodage valide pour l'intensité de la sauce créée
      console.log("Erreur, veuillez choisir un nombre entre 1 & 10 compris !");
    }
    sauce
    .save()
    .then(() =>
    res
    .status(201) // si la sauce est générée avec succès, on renvoie un status 201 (created)
    .json({ message: "Nouvelle sauce créée avec succès !" })
    ) // Dans le cas contraire, on renvoie une erreur !
    .catch((error) => res.status(400).json({ error }));
  }
};

// Concernant la MODIFICATION d'une sauce **************************************************************
// *****************************************************************************************************
