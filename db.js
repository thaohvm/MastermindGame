const { Client } = require("pg");

const config = require('./config');

let db;

if (process.env.NODE_ENV === "production") {
    db = new Client({
        connectionString: config.db.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    });
} else {
    db = new Client({
        connectionString: config.db.DATABASE_URL
    });
}

db.connect();

module.exports = db;
