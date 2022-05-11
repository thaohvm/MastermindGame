"use strict";
const config = require('../config');
const Combination = require('./combination');

class GameInit {
    constructor(sessionId, numDigits, min, max, numAttempts) {
        this.sessionId = sessionId;
        this.numDigits = numDigits;
        this.min = min;
        this.max = max;
        this.numAttempts = numAttempts;
    }
}

class GameResult {
    constructor(sessionId, numAttemptsLeft, numCorrectLocations, numCorrectNumbers, isFinished, combination) {
        this.sessionId = sessionId;
        this.numAttemptsLeft = numAttemptsLeft;
        this.numCorrectLocations = numCorrectLocations;
        this.numCorrectNumbers = numCorrectNumbers;
        this.isFinished = isFinished;
        this.combination = combination;
    }
}

// TODO:
// How to handle when called if finished (e.g., no attempt left)
// How to handle incorrect input (e.g., more digits than allowed)

class Game {
    constructor(sessionId, numDigits = config.game.NUM_DIGITS, min = config.game.MIN, max = config.game.MAX, numAttempts = config.game.NUM_ATTEMPTS) {
        this.sessionId = sessionId;
        this.numDigits = numDigits;
        this.min = min;
        this.max = max;
        this.numAttempts = numAttempts;

        this.combination = null;
        this.guesses = [];
    }

    async init() {
        this.combination = await Combination.getRandomInt(this.numDigits, this.min, this.max);

        return new GameInit(
            this.sessionId,
            this.numDigits,
            this.min,
            this.max,
            this.numAttempts,
        )
    }

    handleGuess(guess) {
        let result = new GameResult(
            this.sessionId,
            this.numAttempts - this.guesses.length - 1,
            0,
            0,
            false,
            []
        );

        // Find correct positions
        for (let i = 0; i < guess.length; i++) {
            if (this.combination[i] === guess[i]) {
                result.numCorrectLocations++;
            }
        }

        // Find correct numbers
        for (let i = 0; i < guess.length; i++) {
            if (this.combination.indexOf(guess[i]) > -1 && this.combination[i] !== guess[i]) {
                result.numCorrectNumbers++;
            }
        }

        result.isFinished = result.numAttemptsLeft === 0 || result.numCorrectLocations === this.numDigits;
        if (result.isFinished) {
            result.combination = this.combination
        }

        this.guesses.push({
            guess: guess,
            result: result,
        });
        return result;
    }

    getCombination() {
        return this.combination;
    }

    getGuesses() {
        return this.guesses;
    }

    getSessionId() {
        return this.sessionId;
    }

    getAttemptsLeft() {
        return this.numAttempts - this.guesses.length;
    }

    isFinished() {
        return this.guesses.length === 0 || this.guesses[this.guesses.length - 1].result.isFinished;
    }
}


module.exports = {
    GameInit: GameInit,
    GameResult: GameResult,
    Game: Game,
};
