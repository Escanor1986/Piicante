const { default: mongoose } = require("mongoose");

mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.ID)
  .then(() => {
    console.log("Connexion à MongoDB ok !");
  })
  .catch((err) => {
    console.log(err + "Problème de connexion à MongoDB !");
  });


