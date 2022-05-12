"use strict";
let cache = require("memory-cache");
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const config = require('./config');
const { Game } = require('./models/game');
const User = require('./models/user');
const ExpressError = require('./error');
const { authenticateJWT } = require('./middleware/auth');

const router = new express.Router();

router.get('/login', (req, res, next) => {
    res.render("login.html");
})

router.get('/register', (req, res, next) => {
    res.render("register.html");
})

router.get('/rule', (req, res, next) => {
    res.render("game_rule.html");
})

router.get('/play', async (req, res, next) => {
    try {
        return res.render("play.html");
    } catch (e) {
        return next(e)
    }
})

// ******** BACKEND APIS ********

router.post("/register", async function (req, res, next) {
    try {
        let { username } = await User.register(req.body);
        let token = jwt.sign({ username }, config.db.SECRET_KEY);
        return res.json({ token });
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
});

router.post("/login", async function (req, res, next) {
    try {
        const { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            const token = jwt.sign({ username }, config.db.SECRET_KEY);
            return res.json({ token });
        } else {
            throw new ExpressError("Invalid username/password", 400);
        }
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
});

router.post("/auth", authenticateJWT, async function (req, res, next) {
    try {
        if (req.user) {
            return res.json({ user: req.user });
        } else {
            res.status(401);
            res.json({ error: "Unauthorized!" });
        }
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
});

router.post('/play/start', authenticateJWT, async (req, res, next) => {
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
        const gameInit = await game.init();
        cache.put(game.getSessionId(), game);
        if (req.user) {
            console.log(`Generated session ${sessionId} for user ${req.user.username}`);
        }
        console.log(`Generated session ${sessionId} with combination ${game.getCombination()}`);
        res.json(gameInit);
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
})

router.post('/play/guess', authenticateJWT, async (req, res, next) => {
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
        console.log(result)
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
})

module.exports = router;
