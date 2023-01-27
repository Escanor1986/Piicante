const userCtrl = require("../controllers/user.controller");
const router = require('express').Router();

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

// Route pour sauvegarder une entrée sur le site (avec express-session) par exemple
router.get("/", (req, res, next) => {
    if (req.session.views) {
        req.session.views += 1;
    } else {
        req.session.views = 1;
    }
    res.end();
});



module.exports = router;