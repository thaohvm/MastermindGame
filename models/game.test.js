"use strict";
const config = require('../config');
const Combination = require('./combination');
const { Game, GameResult } = require('./game');

jest.mock('./combination', () => ({
    ...(jest.requireActual('./combination')),
    getRandomInt: jest.fn(() => [1, 2, 3, 4])
}))

describe("Game: constructor", () => {
    test("should initialize correctly", () => {
        let game = new Game(4, 0, 7, 10);

        expect(game.numDigits).toBe(4);
        expect(game.min).toBe(0);
        expect(game.max).toBe(7);
        expect(game.numAttempts).toBe(10);
        expect(game.sessionId).toBe(0);
        expect(game.combination).toEqual([1, 2, 3, 4]);
        expect(game.guesses).toEqual([]);
        expect(Combination.getRandomInt).toBeCalledTimes(1);
        expect(Combination.getRandomInt).toHaveBeenCalledWith(4, 0, 7);
    })
})

describe("Game: handleGuess", () => {
    test("should return numCorrectLocations correctly", () => {
        let game = new Game(4, 0, 7, 10);

        expect(game.getCombination()).toEqual([1, 2, 3, 4]);
        expect(game.handleGuess([1, 0, 0, 0]).numCorrectLocations).toEqual(1);
        expect(game.handleGuess([0, 1, 0, 0]).numCorrectLocations).toEqual(0);
        expect(game.handleGuess([1, 1, 0, 0]).numCorrectLocations).toEqual(1);
        expect(game.handleGuess([1, 2, 0, 0]).numCorrectLocations).toEqual(2);
    })

    test("should return numCorrectNumbers correctly", () => {
        let game = new Game(4, 0, 7, 10);

        expect(game.getCombination()).toEqual([1, 2, 3, 4]);
        expect(game.handleGuess([1, 0, 0, 0]).numCorrectNumbers).toEqual(0);
        expect(game.handleGuess([0, 1, 0, 0]).numCorrectNumbers).toEqual(1);
        expect(game.handleGuess([1, 1, 0, 0]).numCorrectNumbers).toEqual(1);
        expect(game.handleGuess([1, 2, 0, 0]).numCorrectNumbers).toEqual(0);
    })

    test("should return numAttemptsLeft correctly", () => {
        let game = new Game(4, 0, 7, 4);

        expect(game.numAttempts).toBe(4);
        expect(game.handleGuess([1, 0, 0, 0]).numAttemptsLeft).toEqual(3);
        expect(game.handleGuess([0, 1, 0, 0]).numAttemptsLeft).toEqual(2);
        expect(game.handleGuess([1, 1, 0, 0]).numAttemptsLeft).toEqual(1);
        expect(game.handleGuess([1, 2, 0, 0]).numAttemptsLeft).toEqual(0);
    })

    test("should return isFinished correctly", () => {
        let game = new Game(4, 0, 7, 4);

        expect(game.numAttempts).toBe(4);
        expect(game.handleGuess([1, 0, 0, 0]).isFinished).toBeFalsy;
        expect(game.handleGuess([0, 1, 0, 0]).isFinished).toBeFalsy;
        expect(game.handleGuess([1, 1, 0, 0]).isFinished).toBeFalsy;
        expect(game.handleGuess([1, 2, 0, 0]).isFinished).toBeTruthy;
    })
})

describe("Game: reset", () => {
    test("should return clear all previous states", () => {
        let game = new Game(4, 0, 7, 10);

        expect(game.getCombination()).toEqual([1, 2, 3, 4]);
        game.handleGuess([0, 0, 0, 0]);
        game.reset();
        expect(game.guesses).toEqual([]);
    })
})
