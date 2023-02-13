const express = require('express');
const router = require('express').Router();
const session = require("express-session"); 
const raterLimit = require("express-rate-limit");

// Limite le nombre de tentative de connexion sur le nombre et la durée
const limiter = raterLimit({
    windowMs: 6 * 60 * 1000, 
    max: 60, 
});

const userCtrl = require("../controllers/user.controller");

router.post("/signup", userCtrl.signup);
router.post("/login", limiter, userCtrl.login);

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