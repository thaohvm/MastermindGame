"use strict";
const config = require('../config');
const Combination = require('./combination');
const { Game } = require('./game');

jest.mock('./combination', () => ({
    ...(jest.requireActual('./combination')),
    getRandomInt: jest.fn(() => [1, 2, 3, 4])
}))

describe("Game: constructor", () => {
    test("should initialize correctly", async () => {
        let game = new Game("session", 4, 0, 7, 10);
        await game.init();

        expect(game.numDigits).toBe(4);
        expect(game.min).toBe(0);
        expect(game.max).toBe(7);
        expect(game.numAttempts).toBe(10);
        expect(game.sessionId).toBe("session");
        expect(game.combination).toEqual([1, 2, 3, 4]);
        expect(game.guesses).toEqual([]);
        expect(Combination.getRandomInt).toBeCalledTimes(1);
        expect(Combination.getRandomInt).toHaveBeenCalledWith(4, 0, 7);
    })
})

describe("Game: handleGuess", () => {
    test("should return numCorrectLocations correctly", async () => {
        let game = new Game("session", 4, 0, 7, 10);
        await game.init();

        expect(game.getCombination()).toEqual([1, 2, 3, 4]);
        expect(game.handleGuess([1, 0, 0, 0]).numCorrectLocations).toEqual(1);
        expect(game.handleGuess([0, 1, 0, 0]).numCorrectLocations).toEqual(0);
        expect(game.handleGuess([1, 1, 0, 0]).numCorrectLocations).toEqual(1);
        expect(game.handleGuess([1, 2, 0, 0]).numCorrectLocations).toEqual(2);
    })

    test("should return numCorrectNumbers correctly", async () => {
        let game = new Game("session", 4, 0, 7, 10);
        await game.init();

        expect(game.getCombination()).toEqual([1, 2, 3, 4]);
        expect(game.handleGuess([1, 0, 0, 0]).numCorrectNumbers).toEqual(0);
        expect(game.handleGuess([0, 1, 0, 0]).numCorrectNumbers).toEqual(1);
        expect(game.handleGuess([1, 1, 0, 0]).numCorrectNumbers).toEqual(1);
        expect(game.handleGuess([1, 2, 0, 0]).numCorrectNumbers).toEqual(0);
    })

    test("should return numAttemptsLeft correctly", async () => {
        let game = new Game("session", 4, 0, 7, 4);
        await game.init();

        expect(game.numAttempts).toBe(4);
        expect(game.handleGuess([1, 0, 0, 0]).numAttemptsLeft).toEqual(3);
        expect(game.handleGuess([0, 1, 0, 0]).numAttemptsLeft).toEqual(2);
        expect(game.handleGuess([1, 1, 0, 0]).numAttemptsLeft).toEqual(1);
        expect(game.handleGuess([1, 2, 0, 0]).numAttemptsLeft).toEqual(0);
    })

    test("should return isFinished correctly", async () => {
        let game = new Game("session", 4, 0, 7, 4);
        await game.init();

        expect(game.numAttempts).toBe(4);
        expect(game.handleGuess([1, 0, 0, 0]).isFinished).toBeFalsy;
        expect(game.handleGuess([0, 1, 0, 0]).isFinished).toBeFalsy;
        expect(game.handleGuess([1, 1, 0, 0]).isFinished).toBeFalsy;
        expect(game.handleGuess([1, 2, 0, 0]).isFinished).toBeTruthy;
    })

    test("should keep track guesses and results correctly", async () => {
        let game = new Game("session", 4, 0, 7, 3);
        await game.init();

        const guess1 = [1, 0, 0, 0];
        const result1 = game.handleGuess(guess1);
        expect(game.guesses).toEqual([{ guess: guess1, result: result1 }]);
        const guess2 = [0, 1, 0, 0];
        const result2 = game.handleGuess(guess2);
        expect(game.guesses).toEqual([{ guess: guess1, result: result1 }, { guess: guess2, result: result2 }]);
    })

    test("should only return combination when the game is finished", async () => {
        let game = new Game("session", 4, 0, 7, 2);
        await game.init();

        let result = game.handleGuess([1, 0, 0, 0]);
        expect(result.isFinished).toBeFalsy;
        expect(result.combination).toEqual([]);
        result = game.handleGuess([1, 0, 0, 0]);
        expect(result.isFinished).toBeTruthy;
        expect(result.combination).toEqual(game.combination);
    })
})

describe("Game: getAttempsLeft", () => {
    test("should return number of attempts left correctly", async () => {
        let game = new Game("session", 4, 0, 7, 10);
        await game.init();

        game.handleGuess([1, 0, 0, 0]);
        expect(game.getAttemptsLeft()).toBe(9);
        game.handleGuess([1, 0, 0, 0]);
        expect(game.getAttemptsLeft()).toBe(8);
    });
});

describe("Game: isFinished", () => {
    test("should determine correctly finishing state when runnning out of attempt", async () => {
        let game = new Game("session", 4, 0, 7, 4);
        await game.init();

        expect(game.numAttempts).toBe(4);
        game.handleGuess([1, 0, 0, 0]);
        expect(game.isFinished()).toBeFalsy;
        game.handleGuess([1, 0, 0, 0]);
        expect(game.isFinished()).toBeFalsy;
        game.handleGuess([1, 0, 0, 0]);
        expect(game.isFinished()).toBeFalsy;
        game.handleGuess([1, 0, 0, 0]);
        expect(game.isFinished()).toBeTruthy;
    });

    test("should determine correctly finishing state when guess correctly", async () => {
        let game = new Game("session", 4, 0, 7, 4);
        await game.init();

        expect(game.getCombination()).toEqual([1, 2, 3, 4]);
        expect(game.numAttempts).toBe(4);
        game.handleGuess([1, 0, 0, 0]);
        expect(game.isFinished()).toBeFalsy;
        game.handleGuess([1, 2, 3, 4]);
        expect(game.isFinished()).toBeTruthy;
    });
});
