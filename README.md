# Mastermind

[![tests](https://github.com/thaohvm/MastermindGame/actions/workflows/node.js.yml/badge.svg)](https://github.com/thaohvm/MastermindGame/actions/workflows/node.js.yml)
![License](https://img.shields.io/github/license/thaohvm/MastermindGame)

An implementation of Mastermind game

## About the project

Project's title: MastermindGame

This project is a web application that simulate the Mastermind game where you can play online throught the demo link or you can clone the code and run locally on your computer.

This project is deployed on:

## Game rule

At the start of the game, the computer will randomly select a pattern of four different numbers from a total of 8 different numbers.

A player will have 10 attempts to guess the number combinations.

At the end of each guess, computer provid one of the following response as feedback whether the player had guesses a correct number and its correct location.

If the number is counted as "correct position", it will not be counted in "correct number".

Duplicate numbers are allowed.

## Build with

* [Bootstrap](https://getbootstrap.com)
* [Nodejs](https://nodejs.dev)
* [Express](https://expressjs.com/en/5x/api.html)
* [PostSQL](https://www.postgresql.org/)
* [Jinja](https://jinja2docs.readthedocs.io/en/stable/)

## Geting start
### Installation
1. Clone the repo
```
git clone https://github.com/thaohvm/MastermindGame.git
```
2. Create database for both running website and testing
```
createdb mastermind
createdb masterming_test
```
3. Set up table for database
```
cd MastermindGame
psql < data.sql
```
4. Install requirements packages
```
cd MastermindGame
npm install
```
5. Run the website
```
npm server.js
```
or
```
nodemon server.js
```
6. Go to local website: http://localhost:3000

### Testing
1. Testing models:
```
jest combination.test
jest game.test
jest user.test
jest session.test
```
2. Testing routes:
```
jest routes.test
```

or run all test by

```
jest
```

## Code Structure

```
.
└── MastermindGame/
    ├── models/
    │   ├── combination.js
    │   ├── combination.test.js
    │   ├── game.js
    │   ├── game.test.js
    │   ├── session.js
    │   ├── session.test.js
    │   ├── user.js
    │   └── user.test.js
    ├── static/
    │   ├── css/
    │   │   └── mastermind.css
    │   └── js/
    │       ├── auth.js
    │       ├── login.js
    │       ├── play.js
    │       └── register.js
    ├── templates/
    │   ├── base.html
    │   ├── error.html
    │   ├── game_rule.html
    │   ├── login.html
    │   ├── play.html
    │   ├── register.html
    │   └── top_users.html
    ├── middleware/
    │   └── auth.js
    ├── app.js
    ├── routes.js
    ├── routes.test.js
    ├── server.js
    ├── config.js
    ├── data.sql
    ├── data_test.sql
    ├── db.js
    ├── error.js
    ├── LICENSE
    ├── jsdoc.conf.json
    ├── README.md
    ├── package.json
    └── package-lock.json
```

## Extensions implemented

- User has chance to choose the number digits of combinations as well as the number of attempts.
- User can create an account and has chance to display their name on top 10 user who have the highest wins.

This README should explain how an interviewer could run your code, document your thought process and/or code structure, and describe any creative extensions attempted or implemented. There is no prescribed format for the README, but it should be clear and unambiguous in listing all the steps in building, running, and playing the game you built (you should make no assumptions about what software the interviewer has, and err on the side of being explicit).
