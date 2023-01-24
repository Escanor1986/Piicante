const mongoose = require("mongoose");
const schema = mongoose.Schema;

const userIdSchema = schema(
  {
    email: {
      type: String,
      required: [true, "Un Email unique est requis"],
      unique: true,
    },
    password: { type: String, required: [true, "Un mot de passe est requis"] },
  },
  {
    timestamps: true,
  }
);

userIdSchema.pre("save", function () {
  return userIdSchema
    .countDocuments()
    .exec()
    .then((nbr) => (this.index = nbr + 1));
});

const UserId = mongoose.model("userId", userIdSchema);

module.exports = UserId;
