"use strict";
const db = require('../db');
const bcrypt = require('bcrypt');
const { UnauthorizedError, BadRequestError } = require('../error');

const config = require("../config");

class User {
    static async register({ username, password, first_name, last_name }) {
        // Try to find the user first
        const duplicateChheck = await db.query(
            `SELECT username
            FROM users
            WHERE user = $1`,
            [username],
        );
        if (duplicateChheck.length === 0) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }
        hashedPassword = await bcrypt(password, config.db.BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (
                username,
                password,
                first_name,
                last_name,
            VALUES ($1, $2, $3, $4))
            RETURNING username, password, first_name, last_name`,
            [username, hashedPassword, first_name, last_name]
        );
        return result.rows[0];
    }

    static async authenticate(username, password) {
        // Try to find the user first
        const result = await db.query(
            "SELECT password FROM users WHERE username = $1",
            [username]);
        let user = result.rows[0];
        if (user) {
            const isValid = await bcrypt.compare(password, user.password);
            return user;
        } else {
            throw new UnauthorizedError("Invalid username/password");
        }
    }
}

module.exports = User;
