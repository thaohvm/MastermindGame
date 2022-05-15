"use strict";
const config = require('../config');
const Combination = require('./combination');

/** Class representing the initial metadata of a new game */
class GameInit {
    constructor(sessionId, numDigits, min, max, numAttempts) {
        this.sessionId = sessionId;
        this.numDigits = numDigits;
        this.min = min;
        this.max = max;
        this.numAttempts = numAttempts;
    }
}

/** Class representing the results of one guess */
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

/** Class keeping track and handling game states */
class Game {
    constructor(sessionId, numDigits = config.game.NUM_DIGITS, min = config.game.MIN, max = config.game.MAX, numAttempts = config.game.NUM_ATTEMPTS) {
        this.sessionId = sessionId;
        this.numDigits = numDigits;
        this.min = min;
        this.max = max;
        this.numAttempts = numAttempts;

        this.combination = null;
        this.guesses = [];
        this.finished = false;
        this.won = false;
    }

    /**
     * Generate a new combination for the game and return a fully
     * initialized game metadata object
     * @returns {GameInit} An initialized game metadata object
     */
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

    /**
     * Handle a new guess from the user, update internal state, then
     * return back the results
     * @param {int[]} guess An array of digits guessing from user
     * @returns {GameResult} Results of the guess
     */
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

        this.finished = result.numAttemptsLeft === 0 || result.numCorrectLocations === this.numDigits;
        result.isFinished = this.finished;
        if (this.finished) {
            this.won = result.numCorrectLocations === this.numDigits;
            result.combination = this.combination
        }

        this.guesses.push({
            guess: guess,
            result: result,
        });
        return result;
    }

    /**
     * Return the combination of this game
     * @returns {int[]} Array of combination digits
     */
    getCombination() {
        return this.combination;
    }

    /**
     * Return history of guesses and results
     * @returns {Array.<{guess: int[], result: GameResult}>} An array of past guesses and results
     */
    getGuesses() {
        return this.guesses;
    }

    /**
     * Return the session ID
     * @returns {string} Session ID
     */
    getSessionId() {
        return this.sessionId;
    }

    /**
     * Return number of attempts left
     * @returns {int} Number of attemps left
     */
    getAttemptsLeft() {
        return this.numAttempts - this.guesses.length;
    }

    /**
     * Return finishing status
     * @returns {boolean} True if the game already finishes
     */
    isFinished() {
        return this.finished;
    }

    /**
     * Return won status
     * @returns {boolean} True if user won
     */
    isWon() {
        return this.won;
    }
}


module.exports = {
    GameInit: GameInit,
    GameResult: GameResult,
    Game: Game,
};
