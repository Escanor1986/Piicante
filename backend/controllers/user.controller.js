const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.models");
const passwordSchema = require("../config/password.config");
const emailValidator = require("email-validator");
const MaskData = require("maskdata");

// Concernant le SIGNUP ********************************************************************************
// *****************************************************************************************************

exports.signup = (req, res, next) => {
  const emailMask2Options = {
    maskWith: "*",
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false,
  };
  const email = req.body.email;
  const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
  const checkedPassword = passwordSchema.validate(req.body.password);
  const checkedEmail = emailValidator.validate(req.body.email);
  if (!checkedEmail && !checkedPassword) {
    console.log("Email et/ou Password invalide !");
  } else {
    const salt = bcrypt.genSaltSync(10);
    bcrypt
      .hash(req.body.password, salt)
      .then((hash) => {
        const user = new User({
          email: maskedEmail,
          password: hash,
        });
        user
          .save()
          .then(() =>
            res.status(201).json({
              message:
                "Nouvel utilisateur créé et enregistré dans la base de données avec succès !",
            })
          )
          .catch((error) => res.status(400).json({ error }));
      })
      .catch((error) => res.status(500).json({ error }));
  }
};

// Concernant le LOGIN ********************************************************************************
// ****************************************************************************************************

exports.login = (req, res, next) => {
  const emailMask2Options = {
    maskWith: "*",
    unmaskedStartCharactersBeforeAt: 3,
    unmaskedEndCharactersAfterAt: 2,
    maskAtTheRate: false,
  };
  const email = req.body.email;
  const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
  User.findOne({ email: maskedEmail })
    .then((user) => {
      if (!user) {
        console.log("Utilisateur non trouvé !");
        return res.status(401).json({ error });
      } else {
        bcrypt
          .compare(req.body.password, user.password)
          .then((valid) => {
            if (!valid) {
              console.log("Mot de passe incorrect !");
              return res.status(401).json({ error });
            } else {
              res.status(200).json({
                userId: user._id,
                token: jwt.sign({ userId: user._id }, process.env.SECRET, {
                  expiresIn: "24h",
                }),
              });
            }
          })
          .catch((error) => res.status(500).json({ error }));
      }
    })
    .catch((error) => res.status(500).json({ error }));
};
