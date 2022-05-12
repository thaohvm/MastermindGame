"use strict";
const db = require("../db");
const User = require("./user");

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
    });

    test("can authenticate", async () => {
        let isValid = await User.authenticate("test", "password");
        expect(isValid).toBeTruthy();

        isValid = await User.authenticate("test", "xxx");
        expect(isValid).toBeFalsy();
    });
})
