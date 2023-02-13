const { default: mongoose } = require("mongoose");
const session = require("express-session"); 
const MongoStore = require("connect-mongo"); 
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
