"use strict";
const axios = require('axios');

const config = require('../config');
const Combination = require('./combination');

jest.mock("axios");

describe("Combination: getRandomGeneratorUrl", () => {
    test("should contain base URL", () => {
        const url = Combination.getRandomGeneratorUrl(4, 0, 7);
        expect(url).toContain(config.combination.BASE_URL);
    })
})

describe("Combination: getLocalRandomInt", () => {
    test("generates fixed numbers", () => {
        Math.random = jest.fn(() => 0.5);
        const combination = Combination.getLocalRandomInt(4, 0, 7);
        expect(combination).toEqual([3, 3, 3, 3]);
        expect(Math.random).toHaveBeenCalledTimes(4);
    })

    test("generates random numbers", () => {
        const combination = Combination.getLocalRandomInt(4, 0, 7);
        expect(combination).toHaveLength(4);
        combination.forEach(digit => {
            expect(digit).toBeGreaterThanOrEqual(0);
            expect(digit).toBeLessThanOrEqual(7);
        });
    })
})

describe("Combination: getRandomInt", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("when API call is successful", () => {
        test("should return correct combination", async () => {
            const resp = { data: "1\n2\n3\n4\n" };
            axios.get.mockResolvedValueOnce(resp);

            const combination = await Combination.getRandomInt(4, 0, 7);
            expect(combination).toEqual([1, 2, 3, 4]);
            expect(axios.get).toBeCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(Combination.getRandomGeneratorUrl(4, 0, 7));
        });
    });

    describe("when API call fails", () => {
        test("should fallback on any error", async () => {
            const message = "error message";
            axios.get.mockRejectedValueOnce(new Error(message));
            Combination.getLocalRandomInt = jest.fn(() => [1, 2, 3, 4]);

            const combination = await Combination.getRandomInt(4, 0, 7);
            expect(combination).toEqual([1, 2, 3, 4]);
            expect(axios.get).toBeCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(Combination.getRandomGeneratorUrl(4, 0, 7));
            expect(Combination.getLocalRandomInt).toBeCalledTimes(1);
        });

        test("should fallback when API responses non-200 status code", async () => {
            const resp = { status: 500, data: "error message" };
            axios.get.mockResolvedValueOnce(resp);
            Combination.getLocalRandomInt = jest.fn(() => [1, 2, 3, 4]);

            const combination = await Combination.getRandomInt(4, 0, 7);
            expect(combination).toEqual([1, 2, 3, 4]);
            expect(axios.get).toBeCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(Combination.getRandomGeneratorUrl(4, 0, 7));
            expect(Combination.getLocalRandomInt).toBeCalledTimes(1);
        });

        test("should fallback when API responses with incompatible format", async () => {
            const resp = { status: 200, data: "incompatible results" };
            axios.get.mockResolvedValueOnce(resp);
            Combination.getLocalRandomInt = jest.fn(() => [1, 2, 3, 4]);

            const combination = await Combination.getRandomInt(4, 0, 7);
            expect(combination).toEqual([1, 2, 3, 4]);
            expect(axios.get).toBeCalledTimes(1);
            expect(axios.get).toHaveBeenCalledWith(Combination.getRandomGeneratorUrl(4, 0, 7));
            expect(Combination.getLocalRandomInt).toBeCalledTimes(1);
        });
    });
})
