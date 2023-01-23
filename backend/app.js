const express = require("express");
const app = express();
require("dotenv").config({ path: "./config/.env.example" });
require("./config/Mongo");
const userRoutes = require("./routes/user.routes");
const path = require("path");


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

app.use("/images", express.static(path.join(__dirname, 'images')));

app.use("/api/auth", userRoutes);

module.exports = app;
// // Routes

// app
//   .route("/api/auth", (req, res, next) => {
//     next();
//   })
//   .post("/signup", (req, res) => {
//     res.send("api");
//   })
//   .post("/login", (req, res) => {
//     res.send("api");
//   });

// app
//   .route("/api/sauces", (req, res, next) => {
//     next();
//   })
//   .get((req, res) => {
//     res.send("api");
//   })
//   .get("/:id", (req, res) => {
//     res.send("api");
//   })
//   .post((req, res) => {
//     res.send("api");
//   })
//   .put("/:id", (req, res) => {
//     res.send("api");
//   })
//   .delete("/:id", (req, res) => {
//     res.send("api");
//   })
//   .post("/:id/like", (req, res) => {
//     res.send("api");
//   });

// // Middleware

// app.use((req, res, next) => {
//   console.log("Requête reçue !");
//   next();
// });

// app.use((req, res, next) => {
//   res.status(201);
//   next();
// });

// app.use((req, res, next) => {
//   res.json({ message: "Votre requête a bien été reçue !" });
//   next();
// });

// app.use((req, res, next) => {
//   console.log("Réponse envoyée avec succès !");
// });
