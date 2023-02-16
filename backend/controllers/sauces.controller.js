const colors = require("colors");
const Sauce = require("../models/sauces.models");
const fs = require("fs");

// Concernant la récupération de TOUTES les sauces *****************************************************
// *****************************************************************************************************

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json(colors.red({ error })));
};

// Concernant la récupération d'une SEULE sauce ********************************************************
// *****************************************************************************************************

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json(colors.red({ error })));
};

// Concernant la CREATION d'une sauce ******************************************************************
// *****************************************************************************************************

exports.createSauce = (req, res, next) => {
  const newSauceObject = JSON.parse(req.body.sauce);
  if (newSauceObject.userId !== req.auth.userId) {
    return res.status(403).json(colors.red("⛔ Requête non autorisée ! ⛔"));
  } else {
    const sauce = new Sauce({
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
      .save()
      .then(() => {
        res
          .status(201)
          .json(colors.blue({ message: "Nouvelle sauce créée avec succès !" }));
      })
      .catch((error) => {
        res.status(400).json(colors.red({ error }));
      });
  }
};

// Concernant la SUPPRESSION d'une sauce **************************************************************
// *****************************************************************************************************

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce.userId !== req.auth.userId) {
        return res
          .status(403)
          .json(colors.red("⛔ Requête non autorisée ! ⛔"));
      } else {
        const fileName = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${fileName}`, () => {
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
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
    const unModifedProperties = {
      userId: req.auth.userId,
      likes: sauce.likes,
      dislikes: sauce.dislikes,
      usersLiked: sauce.usersLiked,
      usersDisliked: sauce.usersDisliked,
    };
    if (sauce.userId !== req.auth.userId) {
      return res.status(403).json(colors.red("⛔ Requête non autorisée ! ⛔"));
    } else {
      const fileName = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${fileName}`, () => {
        const sauceObject = req.file
          ? // SI sauceObject = req.file... ALORS...
            {
              ...JSON.parse(req.body.sauce),
              imageUrl: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
              ...unModifedProperties,
            }
          : // SI sauceObject != req.file ==> on récupère l'image d'origine du body
            { ...req.body };
        Sauce.updateOne(
          { _id: req.params.id },

          { ...sauceObject, _id: req.params.id }
        )
          .then(() =>
            res.status(201).json(
              colors.blue({
                message: "Votre sauce a été modifiée avec succès !",
              })
            )
          )
          .catch((error) => res.status(400).json(colors.red({ error })));
      });
    }
  });
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
