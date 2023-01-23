const { default: mongoose } = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.ID)
  .then(() => {
    console.log("Connexion ok !");
  })
  .catch((err) => {
    console.log(err + "Problème de connexion ! Vérifiez votre identifiant et votre mot de passe !");
  });


