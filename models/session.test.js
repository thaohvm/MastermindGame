"use strict";
const db = require("../db");
const { Game } = require("./game");
const Session = require("./session");

beforeEach(async () => {
    await db.query("DELETE FROM sessions");
    await db.query("DELETE FROM users");
});

afterAll(async () => {
    await db.end();
})

describe("Session: put ", () => {
    test("should create a new row in db if data doesn't exist", async () => {
        let game = new Game("session", 4, 0, 7, 4);
        let session = await Session.put(game, "username");
        expect(session).toEqual(session);
    });

    test("should update existing row on updating existing session", async () => {
        let game = new Game("session", 4, 0, 7, 4);
        let session = await Session.put(game, "username");
        expect(session).toEqual(session);

        let result = await db.query(`
        SELECT is_finished, is_won
        FROM sessions
        WHERE session_id = $1`,
            ["session"]);
        expect(result.rows[0].is_finished).toBeFalsy();
        expect(result.rows[0].is_won).toBeFalsy();

        game.finished = true;
        game.won = true;
        session = await Session.put(game, "username");

        result = await db.query(`
        SELECT is_finished, is_won
        FROM sessions
        WHERE session_id = $1`,
            ["session"]);
        expect(result.rows[0].is_finished).toBeTruthy();
        expect(result.rows[0].is_won).toBeTruthy();
    });
});

describe("Session: getGame ", () => {
    test("should return null on non-existent session", async () => {
        let result = await Session.getGame("none");
        expect(result).toEqual(null);
    });

    test("should return correct session given existing session", async () => {
        const game = new Game("session", 4, 0, 7, 4);
        await Session.put(game, "username");
        let result = await Session.getGame("session");
        expect(result).toEqual(game);
    });
});
