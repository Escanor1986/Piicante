const { default: mongoose } = require("mongoose");
const session = require("express-session"); // Package utilisé pour sauvegarder les sessions sur base d'un id (venant (ou pas) des cookies) dans notre base données (atlas par exemple)
const MongoStore = require("connect-mongo"); // utilisé pour le stockage de la session dans mongoDB après la fermeture du serveur
const { app } = require("../app");

// Connexion à MongoDB avec la variable d'environnement
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.ID, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connexion à MongoDB ok !");
  })
  .catch((err) => {
    console.log(err + "Problème de connexion à MongoDB !");
  });

// Middleware de gestion de sessions et de cookies sur MongoDB
// comptage du nombre d'entrée sur le site dans la base de données avec un id unique
app.use(
  session({
    secret: process.env.SESSION_COOKIE_SECRET, // il s'agit du même secret que pour gérer/signer les cookies. Nous permet de signer la session et de sécuriser l'Id par la même occasion
    resave: false, // pour ne pas enregistrer la session à chaque requête même quand rien n'est modifié
    name: "session ID",
    saveUninitialized: true, // p/ex si on ne veut pas traquer le nombre de fois où l'utilisateur vient sur notre site, on va le passer à false
    cookie: {
      signed: true, // les cookies sont signés
      httpOnly: true, // les cookies ne sont pas visibles côté client
      secure: false, // Etant donné que nous ne sommes pas en https, on passe ce paramètre à false
      maxAge: 60 * 60 * 24 * 14 * 1000, // durée de vie des cookies en millisecondes
    },
    store: MongoStore.create({
      // utilisé pour le stockage de la session dans mongoDB après la fermeture du serveur
      mongoUrl: process.env.ID, // Chemin mongoDB
      ttl: 60 * 60 * 24 * 14, // c'est le time to leave, durée en secondes après laquelle la session est supprimée si elle n'est pas utilisée
    }),
  })
);
