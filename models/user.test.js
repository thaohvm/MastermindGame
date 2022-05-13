"use strict";
const db = require("../db");
const User = require("./user");
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../error');

beforeEach(async () => {
    await db.query("DELETE FROM sessions");
    await db.query("DELETE FROM users");
});

afterAll(async () => {
    await db.end();
})

describe("User", () => {
    test("can register", async () => {
        const u = await User.register("joel", "password");

        expect(u.username).toBe("joel");
        expect(u.password).not.toBe(undefined);
        const found = await db.query("SELECT * FROM users WHERE username = 'joel'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("should throw bad request error if username has been exist", async () => {
        await User.register("test", "password");
        try {
            await User.register("test", "password");
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    test("can authenticate", async () => {
        await User.register("test", "password");

        let isValid = await User.authenticate("test", "password");
        expect(isValid).toBeTruthy();

        isValid = await User.authenticate("test", "invalid");
        expect(isValid).toBeFalsy();
    });
})
