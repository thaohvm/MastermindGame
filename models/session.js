"use strict";
const db = require('../db');
const { Game } = require('./game');

/** Class representing a game session in db */
class Session {
    /**
     * Save the current game session metadata and username to a new row
     * in db if it doesn't exist or update the existing row with new data
     * @param {Game} game A game session object
     * @param {string} username Username of the current player
     * @returns {string} The current sessionId
     */
    static async put(game, username) {
        // Check if session already exists
        const existingCheck = await db.query(
            `SELECT session_id
            FROM sessions
            WHERE session_id = $1`,
            [game.sessionId],
        );

        if (existingCheck.rows.length === 0) {
            // If session doesn't exist, insert a new row
            const result = await db.query(
                `INSERT INTO sessions (
                    session_id,
                    username,
                    min,
                    max,
                    num_attempts,
                    num_digits,
                    is_finished,
                    is_won,
                    state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                RETURNING session_id`,
                [game.sessionId,
                    username,
                game.min,
                game.max,
                game.numAttempts,
                game.numDigits,
                game.isFinished(),
                game.isWon(),
                JSON.stringify(game),
                ]);
            let session = result.rows[0];
            return session;
        } else {
            // Otherwise, update the existing session
            const result = await db.query(
                `UPDATE sessions
                 SET is_finished = $2,
                     is_won = $3,
                     state = $4
                 WHERE session_id = $1
                RETURNING session_id`,
                [game.sessionId,
                game.isFinished(),
                game.isWon(),
                JSON.stringify(game),
                ]);
            let session = result.rows[0].session_id;
            return session;
        }
    }

    /**
     * Retrieve a Game object from db if exists
     * @param {string} sessionId The game sessionId
     * @returns {Game} The parsed Game object from db
     */
    static async getGame(sessionId) {
        const result = await db.query(
            `SELECT state
            FROM sessions
            WHERE session_id = $1`,
            [sessionId],
        );

        if (result.rows.length === 0) {
            return null;
        }

        return Object.assign(new Game, JSON.parse(result.rows[0].state));
    }

    /**
     * Retrieve the top 10 users and their wons from db
     * @returns {Array.<{username: string, num_wons: int}>} An array of top 10 users and their wons
     */
    static async getTopWonUsers() {
        const result = await db.query(
            `SELECT username, COUNT(*)
             AS num_wons
             FROM sessions
             WHERE is_won AND username IS NOT NULL
             GROUP BY username
             ORDER BY num_wons
             DESC
             LIMIT 10`
        );

        return result.rows;
    }
}

module.exports = Session;
