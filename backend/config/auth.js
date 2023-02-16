const jwt = require("jsonwebtoken");

// middle d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken.userId;
    req.auth = { userId: userId };
    if (req.body.userId && req.body.userId !== userId) {
      throw error;
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({ error });
  }
};
