"use strict";
const config = require('../config');
const db = require('../db');

const User = require('./user')

class Session {
    static async save(game, username) {
        const user = User.get(username);
        // Check if session already exists
        const existingCheck = await db.query(
            `SELECT session
            FROM sessions
            WHERE sessionId = $1`,
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
                    state)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING session_id, username, min, max, num_attempts, num_digits, is_finished, state`,
                [game.sessionId,
                    username,
                game.min,
                game.max,
                game.numAttempts,
                game.numDigits,
                game.isFinished,
                JSON.stringify(game),
                ]);

            let session = result.rows[0];
            return session;
        }
    }

}
