const jwt = require("jsonwebtoken");
// Utilisation de bcrypt mais nous aurions pu utiliser argon2 également
// (ou les dexu ensembles, sachant que cela réduirait fortement les performances de la machine)
const bcrypt = require("bcrypt");
const argon2 = require("argon2");
const User = require("../models/user.models");
const passwordSchema = require("../config/password.config");
const emailValidator = require("email-validator");
const MaskData = require("maskdata");

// Concernant le SIGNUP ********************************************************************************
// *****************************************************************************************************

exports.signup = async (req, res, next) => {
  try {
    const emailMask2Options = {
      maskWith: "*",
      unmaskedStartCharactersBeforeAt: 3,
      unmaskedEndCharactersAfterAt: 2,
      maskAtTheRate: false,
    };
    const { email, password } = req.body;
    const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);
    const { error: passwordError } = passwordSchema.validate(password);
    const { error: emailError } = emailValidator.validate(email);

    if (passwordError || emailError) {
      return res
        .status(400)
        .json({ message: "Email et/ou Password invalide !" });
    }

    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(409).json({ message: "Cet email est déjà utilisé !" });
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const user = new User({
      email: maskedEmail,
      password: hash,
    });
    await user.save();
    return res.status(201).json({
      message:
        "Nouvel utilisateur créé et enregistré dans la base de données avec succès !",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// Concernant le LOGIN ********************************************************************************
// ****************************************************************************************************

exports.login = async (req, res, next) => {
  try {
    const emailMask2Options = {
      maskWith: "*",
      unmaskedStartCharactersBeforeAt: 3,
      unmaskedEndCharactersAfterAt: 2,
      maskAtTheRate: false,
    };

    const email = req.body.email;
    const maskedEmail = MaskData.maskEmail2(email, emailMask2Options);

    const user = await User.findOne({ email: maskedEmail });

    if (!user) {
      console.log("Utilisateur non trouvé !");
      return res.status(401).json({ error: "Utilisateur non trouvé !" });
    }

    const valid = await bcrypt.compare(req.body.password, user.password);

    if (!valid) {
      console.log("Mot de passe incorrect !");
      return res.status(401).json({ error: "Mot de passe incorrect !" });
    }

    res.status(200).json({
      userId: user._id,
      token: jwt.sign({ userId: user._id }, process.env.SECRET, {
        expiresIn: "24h",
      }),
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Erreur interne du serveur" });
  }
};
