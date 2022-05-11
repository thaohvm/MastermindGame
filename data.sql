\c mastermind

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username text,
    password text
);

CREATE TABLE sessions (
    session_id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id integer NOT NULL REFERENCES users,
    min integer,
    max integer,
    num_attempts integer,


);
