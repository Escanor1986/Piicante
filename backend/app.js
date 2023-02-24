const path = require("path");
const express = require("express");
const cors = require("cors");
const app = express();
const saucesRoutes = require("./routes/sauces.routes");
const userRoutes = require("./routes/user.routes");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const util = require("util");
//on export app vers config
exports.app = app;

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(cookieParser());
require("./config/auth");

// Connexion à mongo &  express-session
require("dotenv").config({ path: "./config/.env" });
require("./config/mongo.config");

const errorHandler = require("errorhandler");
// Permet de retourner une page HTML avec tous les détails de l'erreur

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Content",
      "X-Requested-With",
      "Origin",
    ],
  })
);

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
  res.setHeader("Acces-Control-Max-Age", 80000);
  next();
});

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);
app.use("/api/sauces", saucesRoutes);

// Middelware de Gestion des erreurs pour remplacer celui d'express
if (process.env.NODE_ENV === "development") {
  app.use(errorHandler());
  // ce résultat ne sera pas montré en production car il nous montre le rapport d'erreur de la stack
}

app.use((err, req, res, next) => {
  console.log(process.env.NODE_ENV);
  const env = process.env.NODE_ENV;
  if (env === "production") {
    res.status(500).json({
      code: err.code || 500,
      message: err.message,
    });
  }
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
