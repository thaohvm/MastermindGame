const express = require('express');

const ExpressError = require('./error');
const { Game } = require('./models/game');

const router = new express.Router();

router.get('/rule', (req, res, next) => {
    res.render("game_rule.html");
})

router.get('/play', async (req, res, next) => {
    try {
        let game = new Game("session");
        await game.init();
        const combination = game.getCombination();
        console.log(combination)
        return res.render("play.html", { combination });
    } catch (e) {
        return next(e)
    }
})

router.post('/rule', async (req, res, next) => {
    try {
        const { numGuess, numDigits } = req.body;
        const gameInit = new GameInit({ numGuess, numDigits });
        await gameInit.save();
        return res.redirect('/play')
    } catch (err) {
        return next(err);
    }
})

module.exports = router;
