const mongoose = require("mongoose");

const schema = mongoose.Schema;

const SauceSchema = schema(
  {
    userId: {
      type: String,
      required: [true, "Un identifiant utilisateur MongoDB est requis"],
    },
    name: { type: String, required: [true, "Un nom de sauce est requis"] },
    manufacturer: {
      type: String,
      required: [true, "Un nom de fabricant est requis"],
    },
    description: {
      type: String,
      required: [true, "Une description de la sauce est requise"],
    },
    mainPepper: {
      type: String,
      required: [true, "L'ingrédient épicé principal de la sauce est requis"],
    },
    imageUrl: {
      type: String,
      required: [
        true,
        "L'URL de l'image de la sauce téléchargée par l'utilisateur est requise",
      ],
    },
    heat: {
      type: Number,
      min: 1,
      max: 10,
      required: [true, "Un nombre entre 1 & 10 décrivant la sauce est requis"],
    },
    likes: { type: Number },
    dislikes: { type: Number },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
  },
  {
    timestamps: true,
  }
);

SauceSchema.pre("save", function () {
  return SauceSchema.countDocuments()
    .exec()
    .then((nbr) => (this.index = nbr + 1));
});

const Sauces = mongoose.model("Sauce", SauceSchema);

module.exports = Sauces;
