"use strict";
let cache = require("memory-cache");
const express = require("express");
const { v4: uuidv4 } = require("uuid");

const config = require('./config');
const { Game } = require('./models/game');
const User = require('./models/user')
const ExpressError = require('./error')

const router = new express.Router();


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
        const gameInit = await game.init();
        cache.put(game.getSessionId(), game);
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
        console.log(result)
    } catch (err) {
        res.status(500);
        res.json({ error: err.message })
    }
})
// ******************************************** USER ROUTES ***********************************************

/** login: {username, password} => {token} */

router.post("user/login", async function (req, res, next) {
    try {
        let { username, password } = req.body;
        if (await User.authenticate(username, password)) {
            let token = jwt.sign({ username }, SECRET_KEY);
            return res.json({ token });
        } else {
            throw new ExpressError("Invalid username/password", 400);
        }
    }

    catch (err) {
        return next(err);
    }
});

/** register user: registers, logs in, and returns token.
 *
 *
 */

router.post("/user/register", async function (req, res, next) {
    try {
        let { username } = await User.register(req.body);
        let token = jwt.sign({ username }, SECRET_KEY);
        return res.json({ token });
    }

    catch (err) {
        return next(err);
    }
});

module.exports = router;
