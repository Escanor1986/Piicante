// path est un module natif de nodejs, il permet de d'effectuer des opérations sur les fichiers et dossiers
// 
const path = require("path");
// express est un framework de nodejs permettant la création du serveur beaucoup plus facilement
// la création d'un serveuren node pure serait très laborieux, express nous facilite la tâche 
const express = require("express");
const app = express();
const saucesRoutes = require("./routes/sauces.routes");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
// Helmet est utilisé pour sécuriser les headers http. https://expressjs.com/fr/advanced/best-practice-security.html
const helmet = require("helmet");
const bodyParser = require("body-parser");
//on export app vers config
exports.app = app;

app.use( // Résolution du problème de CORP rencontré notamment avec les images des sauces
  helmet({
    crossOriginResourcePolicy: false,
    crossOriginReadBlocking: false,
  })
);
app.use(cookieParser());
require("./config/auth");

// Connexion à mongo &  express-session
require("dotenv").config({ path: "./config/.env" });
require("./config/mongo.config");

const errorHandler = require("errorhandler"); // Permet de retourner une page HTML avec tous les détails de l'erreur

app.use((req, res, next) => {
  // "Access-Control-Allow-Origin" va permettre au nvaigateur de comparer
  res.setHeader("Access-Control-Allow-Origin", "*");
  // "Access-Control-Allow-Headers" va contenir tous les headers demandés
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // "Access-Control-Allow-Methods" ca contenir la/les méthodes de la/des requête(s) demandé(es)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    // Pour autant que les requête soit authorisée par le serveur, 
    // il va mettre en cache des données pour la durée déterminée afin de ne pas
    // devoir effectuer une nouvelle requête de type "preflight" (Options) à chaque requête au serveur
    "Acces-Control-Max-Age", 80000
  )
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
// va voir les requêtes venant du côté client (images, javascript, etc...)
// express.static est un des trois middleware "built in" de Express
// Dans ce cas il retourne une image lorsque l'on en a besoin sans devoirs créer une route pour chaque image
app.use("/images", express.static(path.join(__dirname, "images"))); 
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

// Middelware de Gestion des erreurs pour remplacer celui d'express
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler()); // ce résultat ne sera pas montré en production car il nous montre le rapport d'erreur de la stack
}

app.use((err, req, res, next) => {
  console.log(process.env.NODE_ENV);
  const env = process.env.NODE_ENV;
  if (env === "production") {
    // en json retourne message d'erreur dans la console, pour une application serveur, on rendra une page d'erreur en html
    res.status(500).json({
      code: err.code || 500,
      message: err.message,
    });
  }
  next();
});

app.use((req, res, next) => {
  console.log("Requête reçue !");
  next();
});

app.use((req, res, next) => {
  res.status(201);
  next();
});

app.use((req, res, next) => {
  res.json({ message: "Votre requête a bien été reçue !" });
  next();
});

app.use((req, res, next) => {
  console.log("Réponse envoyée avec succès !");
});

//on exporte app pour l'utiliser ailleurs
module.exports = app;


