\c mastermind
\c mastermind_test

DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    username VARCHAR(25) PRIMARY KEY,
    password TEXT NOT NULL
);

CREATE TABLE sessions (
    session_id text PRIMARY KEY,
    username VARCHAR(25) REFERENCES users ON DELETE CASCADE,
    min INTEGER,
    max INTEGER,
    num_attempts INTEGER,
    num_digits INTEGER,
    is_finished boolean,
    state text
);

INSERT INTO users(username, password)
VALUES ()
