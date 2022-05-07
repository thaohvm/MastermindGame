const express = require('express');
const router = new express.Router();
const Combination = require('./models/combination');
const ExpressError = require('./expressError');

const NUM_OF_DIGIT = 4;

router.get('/rule', (req, res, next) => {
    res.render("game_rule.html");
})

router.get('/play', async (req, res, next) => {
    try {
        const combination = await Combination.getRandomInt(NUM_OF_DIGIT);
        console.log(combination)
        return res.render("play.html", { combination });
    } catch (e) {
        return next(e)
    }
})

module.exports = router;
