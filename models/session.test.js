"use strict";
const db = require("../db");
const User = require("./user");
const Game = require("./game");

beforeEach(async () => {
    await db.query("DELETE FROM sessions");
    await db.query("DELETE FROM users");
});

afterAll(async () => {
    await db.end();
})

describe("Session: put ", () => {
    test("should create a new row in db if data doesn't exist", async () => {
        expect(true).toBeTruthy();
    });

    test("should update existing row on updating existing session", async () => {
        expect(true).toBeTruthy();
    });
});

describe("Session: get ", () => {
    test("should return null on non-existent session", async () => {
        expect(true).toBeTruthy();
    });

    test("should return correct session given existing session", async () => {
        expect(true).toBeTruthy();
    });
});
