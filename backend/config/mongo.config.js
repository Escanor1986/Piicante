const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { app } = require("../app");

// Connexion à MongoDB avec la variable d'environnement
mongoose.set("strictQuery", false);

(async () => {
  try {
    await mongoose.connect(process.env.ID, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connexion à MongoDB ok !");
  } catch (error) {
    console.error(`Problème de connexion à MongoDB : ${error}`);
  }
})();

// Middleware de gestion de sessions et de cookies sur MongoDB
// comptage du nombre d'entrée sur le site dans la base de données avec un id unique
app.use(
  session({
    secret: process.env.SESSION_COOKIE_SECRET,
    resave: false,
    name: "session ID",
    saveUninitialized: true,
    cookie: {
      signed: true,
      httpOnly: true,
      secure: false,
      maxAge: 60 * 60 * 24 * 14 * 1000,
    },
    store: MongoStore.create({
      mongoUrl: process.env.ID,
      ttl: 60 * 60 * 24 * 14,
    }),
  })
);
