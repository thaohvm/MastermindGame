"use strict";
const bcrypt = require('bcrypt');
const res = require('express/lib/response');
const { password } = require('pg/lib/defaults');

const config = require('../config');
const db = require('../db');
const { BadRequestError, UnauthorizedError, NotFoundError } = require('../error');

class User {
    static async register({ username, password }) {
        // Try to find the user first
        const duplicateCheck = await db.query(
            `SELECT username
            FROM users
            WHERE username = $1`,
            [username],
        );
        if (duplicateCheck.rows.length > 0) {
            throw new BadRequestError(`Duplicate username: ${username}`);
        }
        const hashedPassword = await bcrypt.hash(password, config.db.BCRYPT_WORK_FACTOR);
        const result = await db.query(
            `INSERT INTO users (
                username,
                password)
            VALUES ($1, $2)
            RETURNING username, password`,
            [username, hashedPassword]
        );
        return result.rows[0];
    }

    static async authenticate(username, password) {
        const result = await db.query(
            `SELECT password FROM users WHERE username = $1`,
            [username]);
        let user = result.rows[0];

        return user && await bcrypt.compare(password, user.password);
    }

    static async get(username) {
        const result = await db.query(
            `SELECT username, password
            FROM users
            WHERE username = $1`,
            [username]
        )
        const user = result.rows[0];
        if (!user) throw new NotFoundError(`No user: ${username}`);
        return user;
    }
}

module.exports = User;
