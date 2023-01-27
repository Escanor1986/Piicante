const path = require("path");
const express = require("express");
const userRoutes = require("./routes/user.routes");
const cookieParser = require('cookie-parser');
const app = express();
// Helmet est utilisé pour sécuriser les headers http. https://expressjs.com/fr/advanced/best-practice-security.html
const helmet = require("helmet");
const bodyParser = require("body-parser");
//on export app vers config
exports.app = app;

app.use(cookieParser());
require('./config/jwt.config');

// Connexion à mongo &  express-session
require("dotenv").config({ path: "./config/.env" });
require("./config/mongo.config");

const errorHandler = require("errorhandler"); // Permet de retourner une page HTML avec tous les détails de l'erreur

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use(bodyParser.json());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(path.join(__dirname, "public"))); // va voir les requêtes venant du côté client (images, javascript, etc...)
app.use("/api/auth", userRoutes);

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
});

//on exporte app pour l'utiliser ailleurs
module.exports = app;
