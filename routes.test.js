"use strict";
const request = require("supertest");
const express = require("express");

const app = require("./app");

jest.mock('./models/combination', () => ({
    ...(jest.requireActual('./models/combination')),
    getRandomInt: jest.fn(() => [1, 2, 3, 4])
}))

describe("POST /play/start", () => {
    test("should return full init data", async () => {
        let response = await request(app)
            .post("/play/start")

        expect(response.body).toEqual({
            "sessionId": expect.any(String),
            "numDigits": 4,
            "min": 0,
            "max": 7,
            "numAttempts": 10
        });
    });

    test("should overwrite default values if provided", async () => {
        let response = await request(app)
            .post("/play/start")
            .send({
                "numDigits": 10,
                "min": 1,
                "max": 5,
                "numAttempts": 1
            });

        expect(response.body).toEqual({
            "sessionId": expect.any(String),
            "numDigits": 10,
            "min": 1,
            "max": 5,
            "numAttempts": 1
        });
    });
});

describe("POST /play/guess", () => {
    test("should handle guesses correctly", async () => {
        let response = await request(app)
            .post("/play/start")
            .send({
                "numDigits": 4,
                "min": 0,
                "max": 7,
                "numAttempts": 3
            });
        const sessionId = response.body.sessionId;

        response = await request(app)
            .post("/play/guess")
            .send({
                "sessionId": sessionId,
                "guess": [1, 2, 5, 0]
            })
        expect(response.body).toEqual({
            "sessionId": sessionId,
            "numAttemptsLeft": 2,
            "numCorrectLocations": 2,
            "numCorrectNumbers": 0,
            "isFinished": false,
            "combination": [],
        });

        response = await request(app)
            .post("/play/guess")
            .send({
                "sessionId": sessionId,
                "guess": [1, 2, 3, 4]
            })
        expect(response.body).toEqual({
            "sessionId": sessionId,
            "numAttemptsLeft": 1,
            "numCorrectLocations": 4,
            "numCorrectNumbers": 0,
            "isFinished": true,
            "combination": [1, 2, 3, 4],
        });
    });

    test("should throw error if sessionId doesn't exist", async () => {
        let response = await request(app)
            .post("/play/guess")
            .send({
                "sessionId": "sessionId",
                "guess": [1, 2, 5, 0]
            })
        expect(response.statusCode).toEqual(404);
    });
});
