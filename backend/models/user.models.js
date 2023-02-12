const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const schema = mongoose.Schema;

const userIdSchema = schema({
  email: {
    type: String,
    required: [true, "Un Email unique est requis"],
    unique: true,
  },
  password: { type: String, required: [true, "Un mot de passe est requis"] },

  Username: String,
},
{
  timestamps: true, // représente la durée de temps qui s'est écoulée depuis un moment "m"
});

userIdSchema.plugin(uniqueValidator);
const User = mongoose.model("UserId", userIdSchema);
module.exports = User;
