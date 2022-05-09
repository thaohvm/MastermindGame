"use strict";
const config = require('../config');
const Combination = require('./combination');


class GameResult {
    constructor(sessionId, numAttemptsLeft, numCorrectLocations, numCorrectNumbers, isFinished) {
        this.sessionId = sessionId;
        this.numAttemptsLeft = numAttemptsLeft;
        this.numCorrectLocations = numCorrectLocations;
        this.numCorrectNumbers = numCorrectNumbers;
        this.isFinished = isFinished;
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
    }

    handleGuess(guess) {
        let result = new GameResult(
            this.sessionId,
            this.numAttempts - this.guesses.length - 1,
            0,
            0,
            false,
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

    isFinished() {
        return this.guesses.length === 0 || this.guesses[this.guesses.length - 1].result.isFinished;
    }
}

module.exports = {
    Game: Game,
    GameResult: GameResult,
};
