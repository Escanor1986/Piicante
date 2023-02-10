// jwt permet de s'assurer de l'intégrité et de l'authentification d'un message
// mais PAS DE LE RENDRE CONFIDENTIEL pour la cause -  il utilise la
// cryptographie/encryption asymétrique (elle utilise une clé publique et une privé)
const jwt = require("jsonwebtoken");
// package utilisé pour le crytage/hashage du mot de passe, il va ajouter et concaténer une chaîne de caractère
// aléatoire au mot de passe en clair avant le hashage au cas où il y aurait plusieurs mots de passes identiques
// dans la base de données   exemple : user1  |  testpwd + 12fd1h  => XxXxXxXxXxX au cas où  user2  |   testpwd + 54ze3k  =>  XXXxxxXXXxx
const bcrypt = require("bcrypt");
// méthode native de node pour afficher le détails de l'erreur avec des couleurs dans la stack via le temrinal
const util = require("util");
// affiche un message d'erreur à utiliser en développement et ne sera pas retourné au client
const logError = require("http-errors");
// On importe User depuis models
const User = require("../models/user.models");
const passwordSchema = require("../config/password.config");
const emailValidator = require("email-validator"); // fonctionne "comme une regexp"


// Concernant le SIGNUP
// !!! req et res sont des "flux" mais également des "eventEmitter" !!! 
exports.signup = (req, res, next) => {
  // checking du password avec la méthode validate
  const checkedPassword = passwordSchema.validate(req.body.password);
  // checking de l'email avec validator
  const checkedEmail = emailValidator.validate(req.body.email);
  // on vérifie d'abord si le password et l'email ne corresponde pas aux exigences/critères préétablis
  if (!checkedEmail && !checkedPassword) {
    console.log(
      "Email et/ou Password invalide !"
    );
  } else {
    bcrypt
      // on hash le mot de passe 10x avec un "salt" paramètré à 10
      // (+ de 10 risque de ralentir la machine suite à augmentation calcul exponentiel niveau processeur)
      .hash(req.body.password, 10)
      .then((hash) => {
        // Création du module User sur base du Schema importé depuis models
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        // Enregistrement de l'utlisateur dans la base de données
        user
          .save()
          // Renvoie d'un statut 201
          .then(() =>
            res.status(201).json({
              message:
                "Nouvel utilisateur créé et enregistré dans la base de données avec succès !",
            })
          )
          .catch((error) => res.status(400).json({ error })); // bad request
      })
      .catch((error) => res.status(500).json({ error })); // internal server error
  }
};

// Concernant le LOGIN
exports.login = (req, res, next) => {
  // récupération de l'adresse email du module de l'utilisateur avec la méthode "findOne" (utlisable également dans le CLI)
  User.findOne({ email: req.body.email })
    .then((user) => {
      // Si l'email n'est pas encore renseigné dans la base données
      if (!user) {
        console.log("Utilisateur non trouvé !");
        return res.status(401).json({ error });
      } else {
        // dans le cas contraire, on compare simplement avec "bcrypt" le mdp user enregistré lors du signup avec celui encodé dans le login
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              console.log("Mot de passe incorrect !");
              return res.status(401).json({ error });
            } else {
              // Dans le cadre d'une validation après comparaison, on renvoie un status 201
              res.status(200).json({
                userId: user._id, // renvoie de l'userID depuis config
                token: jwt.sign(
                  // renvoie un token signé
                  { userId: user._id },
                  // on récupère le secret depuis le fichier caché .env
                  process.env.SECRET,
                  {
                    expiresIn: "24h"
                  }
                ),
              });
            }
          })  // internal server error
          .catch((error) => res.status(500).json({ error }));
      }
    })  // internal server error
    .catch((error) => res.status(500).json({ error }));
};

// console.log(
//   util.inspect(e, {
//     compact: true,
//     depth: 5,
//     breakLength: 80,
//     colors: true,
//   })
// );
