const User = require("../queries/user.queries");
const util = require("util"); // méthode native de node pour afficher le détails de l'erreur avec des couleurs dans la stack via le temrinal
const createError = require("http-errors"); // affiche un message d'erreur à utiliser en développement et ne sera pas retourné au client

exports.signup = async (req, res, next) => {
  try {
    const body = req.body;
    console.log({ body });
    const newUser = new User({
      ...body,
      active: body.active ? true : false,
    });
    await newUser.save();
    console.log({ newUser });
    res.redirect("/");
  } catch (e) {
    const errors = Object.keys(e.errors).map((key) => e.errors[key].message);
    res.status(400).json({
      code: err.code || 400,
      message: err.message,
    });
  }
};

// console.log(
//   util.inspect(errors, {
//     compact: true,
//     depth: 5,
//     breakLength: 80,
//     colors: true,
//   })
// );