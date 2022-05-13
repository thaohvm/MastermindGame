\c mastermind_test

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username VARCHAR(25) UNIQUE PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE sessions (
    session_id TEXT PRIMARY KEY,
    username VARCHAR(25),
    min INTEGER,
    max INTEGER,
    num_attempts INTEGER,
    num_digits INTEGER,
    is_finished BOOLEAN,
    is_won BOOLEAN,
    state TEXT
);
