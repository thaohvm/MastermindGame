const express = require('express');
const router = new express.Router();
const Combination = require('./models/mastemind')

const NUM_OF_DEGIT = 4;
const NUM_OF_ATTEMPS = 10;

router.get('/rule', (req, res, next) => {
    res.render("game_rule.html");
})

router.get('/play', async (req, res, next) => {
    try {
        const answer = await Combination.makeRandNum(NUM_OF_DEGIT);
        return res.render("play.html", { answer });
    } catch (e) {
        return next(err)
    }
})

module.exports = router;
