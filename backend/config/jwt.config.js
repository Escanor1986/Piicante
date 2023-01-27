const jwt = require("jsonwebtoken");
// const { findUserPerId } = require("../queries/user.queries");
// const { app } = require('../app');

// middle d'authentification
module.exports = (req, res, next) => {
  try {
    // On récupère le Bearer Token dans le header authorization
    const token = req.headers.authorization.split(" ")[1];
    // vérification de la correspondance du Token avec le secret
    // secret algo symétrique généré depuis UUID generator tools
    const decodedToken = jwt.verify(token, process.env.SECRET);
    // Récupération du user décodé
    const userID = decodedToken.userID;
    // Rajout de l'id du user à l'objet de la requête
    req.auth = { userID: userID };
    // en cas d'un userid exsitant, et de plus, si les id sont != |e|
    // le token et la query alors on renvoi une erreure
    // dans le cas contraire ce sera validé
    if (req.body.userID && req.body.userID !== userID) {
      throw error;
    } else {
      next();
    }
  } catch (error) {
    // En cas d'erreur on renvoie un sttaus 401 à l'utilisateur
    res.status(401).json({ error });
  }
};

// PREMIERE METHODE AVEC COOKIES NON FONCTIONNELLE !!!

// const createJwtToken = (user) => {
//     const jwtToken = jwt.sign(
//       {
//         sub: user._id.toString(),
//       },
//       secret
//     );
//     return jwtToken;
//   };

// exports.createJwtToken = createJwtToken;

// const extractUserFronToken = async (req, res, next) => {
//   const token = req.cookies.jwt;
//   if (token) {
//     try {
//       const decodedToken = jwt.verify(token, secret);
//       const user = await findUserPerId(decodedToken.sub);
//       if (user) {
//         req.user = user;
//         next();
//       } else {
//         res.clearCookie("jwt");
//         res.redirect("/");
//       }
//     } catch (e) {
//       res.clearCookie("jwt");
//       res.redirect("/");
//     }
//   } else {
//     next();
//   }
// };

// const addJwtFeatures = (req, res, next) => {
//     req.isAuthenticate = () => !!req.user;
//     // le premier point d'exclamation converti req.user en boolean en donnant la valeur inverse
//     // le second point d'exlamation permet de récupérer la valeur qui nous intéresse et prouve
//     // que req.user existe
//     // il n'y a pas d'accolade autour de req.user car on va le retourner directement
//     // ce n'est possible que quand il y a une seule instruction
//     req.logout = () => res.clearCookie('jwt');
//     req.login = (user) => {
//         const token = createJwtToken(user);
//         res.cookie('jwt', token);
//     }
//     next();
//     // il s'agit ici d'un middleware donc ne surtout pas oublié la méthode next() au risque
//     // au risque de bloquer la chaîne des middlewares !!!
// }

// app.use(extractUserFronToken);
// app.use(addJwtFeatures);
