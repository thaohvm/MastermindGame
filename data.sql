\c mastermind

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username text,
    hashed_password text
    first_name text NOT NULL,
    last_name text NOT NULL,
);
