"use strict";
const db = require("../db");
const User = require("./user");
const { BadRequestError, UnauthorizedError } = require('../error');

beforeEach(async () => {
    await db.query("DELETE FROM sessions");
    await db.query("DELETE FROM users");

    let u = await User.register({
        username: "test",
        password: "password",
    });
});

afterAll(async () => {
    await db.end();
})

describe("User", () => {
    test("can register", async () => {
        let u = await User.register({
            username: "joel",
            password: "password",
        });

        expect(u.username).toBe("joel");
        expect(u.password).not.toBe(undefined);
        const found = await db.query("SELECT * FROM users WHERE username = 'joel'");
        expect(found.rows.length).toEqual(1);
        expect(found.rows[0].password.startsWith("$2b$")).toEqual(true);
    });

    test("should throw bad request error if username has been exist", async () => {
        try {
            await User.register({
                username: "test",
                password: "psw",
            });
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });

    test("can authenticate", async () => {
        let isValid = await User.authenticate("test", "password");
        expect(isValid).toBeTruthy();

        isValid = await User.authenticate("test", "xxx");
        expect(isValid).toBeFalsy();
    });
})
