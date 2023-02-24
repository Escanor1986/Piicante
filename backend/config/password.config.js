const passwordValidator = require("password-validator");
const passwordSchema = new passwordValidator();

// Modèle du mot de passe à encodé au signup et au login
// protection contre les attaques par force brute et les attaques par injection de code
passwordSchema
  .is()
  .min(8)
  .is()
  .max(100)
  .has()
  .uppercase(1)
  .has()
  .lowercase()
  .has()
  .symbols()
  .has()
  .not()
  .digits()
  .is()
  .not(/[\]()[{}<>@'"\/\\|]/)
  .has()
  .not()
  .spaces()
  .is()
  .not()
  .oneOf(["Passw0rd", "Password123", "123456789", "iLoveYou", "Master"]) // liste noir des valeurs interdites
  .is()
  .not((value, { req, location, path }) => {
    // Vérifie que le mot de passe ne contient pas d'informations sensibles
    const username = req.body.username;
    const email = req.body.email;
    return (
      value.includes(username) ||
      value.includes(email) ||
      value.toLowerCase().includes("password")
    );
  });

// on exporte le Schema password
module.exports = passwordSchema;
