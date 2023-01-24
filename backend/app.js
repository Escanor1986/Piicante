const path = require("path");
const express = require("express");
const app = express();
require("dotenv").config({ path: "./config/.env.example" });
require("./config/Mongo");
const userRoutes = require("./routes/user.routes");
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

app.use(express.json());
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

module.exports = app;
