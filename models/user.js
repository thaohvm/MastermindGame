"use strict";
const bcrypt = require('bcrypt');
const res = require('express/lib/response');

const config = require('../config');
const db = require('../db');
const { BadRequestError } = require('../error');

/** Class representing a user in database */
class User {
    /**
     * Register a new user to the db
     * @param {string} username The player's username
     * @param {string} password The player's password
     * @returns {{string, string}} The username and hashed password
     */
    static async register(username, password) {
        this.checkValidInput(username, password);
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

    /**
     * Check if the given username and password matched with the corresponding
     * hashed password in the db
     * @param {string} username The player's username
     * @param {string} password The player's password
     * @returns {boolean} True if user is authenticated
     */
    static async authenticate(username, password) {
        this.checkValidInput(username, password);
        const result = await db.query(
            `SELECT password FROM users WHERE username = $1`,
            [username]);
        let user = result.rows[0];

        return user && await bcrypt.compare(password, user.password);
    }

    /**
     * Check if username and password have valid format and
     * throw BadRequestError otherwise
     * @param {string} username The player's username
     * @param {string} password The player's password
     */
    static checkValidInput(username, password) {
        if (!username || !password) {
            throw new BadRequestError("Invalid username/password");
        }
    }
}

module.exports = User;
