"use strict";
let cache = require("memory-cache");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const config = require('./config');
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

// Backend APIs
router.post('/play/start', async (req, res, next) => {
    try {
        let sessionId = uuidv4();
        const data = req.body;
        let game = new Game(
            sessionId,
            data.numDigits ? data.numDigits : config.game.NUM_DIGITS,
            data.min ? data.min : config.game.MIN,
            data.max ? data.max : config.game.MAX,
            data.numAttempts ? data.numAttempts : config.game.NUM_ATTEMPTS
        );
        cache.put(game.getSessionId(), game);
        const gameInit = await game.init();
        console.log(`Generated session ${sessionId} with combination ${game.getCombination()}`);
        res.json(gameInit);
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
})

router.post('/play/guess', async (req, res, next) => {
    try {
        const data = req.body;
        let game = cache.get(data.sessionId);
        if (game === null) {
            // Throw error if sessionId doesn't exist
            res.status(404);
            res.json({ error: "SessionID doesn't exist!" });
            return res;
        }
        let result = game.handleGuess(data.guess);
        res.json(result)
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
})

module.exports = router;
