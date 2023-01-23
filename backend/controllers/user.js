const User = require("../models/userModels");
const util = require("util");

exports.signup = (req, res, next) => {
  const body = req.body;
  console.log({ body });
  const newUser = new User({
    ...body,
    active: body.active ? true : false,
  });

  console.log({ newUser });

  newUser
    .save()
    .then((user) => {
      console.log({ user });
      res.redirect("/");
    })
    .catch((err) => {
      const errors = err.errors;
      console.log(
        util.inspect(errors, {
          compact: true,
          depth: 5,
          breakLength: 80,
          colors: true,
        })
      );
      res.status(400).render("user.routes");
    });
};

