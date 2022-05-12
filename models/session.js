"use strict";
const config = require('../config');
const db = require('../db');

class Session {
    static async save(data) {
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
            RETURNING session_id, username, min, max, num_attempts, num_digits, is_finished, state`
        )
    }
}
