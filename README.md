# Mastermind

[![tests](https://github.com/thaohvm/MastermindGame/actions/workflows/node.js.yml/badge.svg)](https://github.com/thaohvm/MastermindGame/actions/workflows/node.js.yml)
![License](https://img.shields.io/github/license/thaohvm/MastermindGame)

An implementation of Mastermind game

## About the project

Project's title: MastermindGame

This project is a web application that simulates the Mastermind game where you can play online through the demo link or clone the code then run locally on your computer.

Try me at [mmind-game.herokuapp.com](https://mmind-game.herokuapp.com/)!

## Game rule

At the start of the game, the server will randomly select a combination of different numbers (default to 4 numbers from 0 to 7 inclusively, with duplicates allowed). A player will have a number of attempts to guess the combinations (default to 10 attempts).

At the end of each guess, the server will provide one of the following responses: (1) the player had guessed a correct number, (2) the player had guessed a correct number and its correct location, (3) the player's guess was incorrect. The feedback to the user will be in the form of total "correct positions" and total "correct numbers" (but incorrect location). If the number is counted as "correct position", it will not be counted in "correct numbers".

## Built with

* [Node.js](https://nodejs.dev)
* [Express](https://expressjs.com/en/5x/api.html)
* [PostSQL](https://www.postgresql.org/)
* [Jinja](https://jinja2docs.readthedocs.io/en/stable/)
* [Bootstrap](https://getbootstrap.com)
* [JSDoc](https://jsdoc.app/)
* [Jest](https://jestjs.io/)

## Getting started

### Prerequisites

In order to run/develop this project locally, Node.js and PostgreSQL (including CLI tools) must be installed on the developing machine.
- Node.js could be downloaded and installed on corresponding platform on [Node.js website](https://nodejs.org/en/download/)
- PostgreSQL installation instructions are available on [PostgreSQL website](https://www.postgresql.org/docs/current/tutorial-install.html)

### Installation

```
# Clone the repo
git clone https://github.com/thaohvm/MastermindGame.git
cd MastermindGame

# Create PostgreSQL database
createdb mastermind

# Set up tables for the database
psql < data_test.sql

# Install requirements packages
npm install

# Run the website
npm run dev
```

The game should be available at: http://localhost:3000

### Documentation

Backend classes and APIs are documented with docstring with documentation auto-generated via JSDoc and available to [view online](https://htmlpreview.github.io/?https://github.com/thaohvm/MastermindGame/blob/master/docs/index.html).

### Testing

Backend classes and APIs have unittest coverage that is automatically validated on each commit with [Github Action](https://github.com/thaohvm/MastermindGame/actions) or manually as follows:

```
# Test models
jest combination.test
jest game.test
jest user.test
jest session.test

# Test routes
jest routes.test

# Run all tests
npm run test
```

### Deployment

This project is currently deployed on [Heroku](https://mmind-game.herokuapp.com/) and could be scale easily with more workers as the game states are stored in the database. For more up-to-date instructions, please follow [Heroku documentation](https://devcenter.heroku.com/articles/deploying-nodejs).

```
# Login and create a new app
heroku login
heroku create <unique app name>

# Configure PostgreSQL
heroku addons:create heroku-postgresql:hobby-dev
heroku pg:psql < data.sql

# Deploy to heroku
heroku config:set SECRET_KEY=<new random secret>
git push heroku master
```

### Configuration

The server has several configurable environment variables that could be used to customize the game experience. These variables are defined in [`config.js`](config.js) and as details below:

- `PORT`: (3000) port the server will listen to;
- `COMBINATION_BASE_URL`: (https://www.random.org/integers) Random Generator base URL
- `GAME_NUM_ATTEMPTS`: (10) default number of attempts
- `GAME_NUM_DIGITS`: (4) default number of digits in a combination
- `GAME_MIN`: (0) default digit minimum
- `GAME_MAX`: (7) default digit maximum
- `DATABASE_URL`: (postgresql:///mastermind_test) database connection
- `SECRET_KEY`: (secret) token encryption key, must be changed on production deployment
- `BCRYPT_WORK_FACTOR`: (12) hashing work factor

To override the default values, you could provide the matching environment variables. For example:
```
# Override locally
GAME_MIN=4 GAME_MAX=8 npm run dev

# Override in heroku
heroku config:set GAME_MIN=4
heroku config:set GAME_MAX=8
```

## Project Structure

```
.
└── MastermindGame/  # project root
    ├── docs/  # API documentation
    │   ├── ...
    ├── models/  # backend classes and unittest
    │   ├── combination.js
    │   ├── combination.test.js
    │   ├── game.js
    │   ├── game.test.js
    │   ├── session.js
    │   ├── session.test.js
    │   ├── user.js
    │   └── user.test.js
    ├── static/  # frontend static resources
    │   ├── css/
    │   │   └── mastermind.css
    │   └── js/
    │       ├── auth.js
    │       ├── login.js
    │       ├── play.js
    │       └── register.js
    ├── templates/  # html templates
    │   ├── base.html
    │   ├── error.html
    │   ├── game_rule.html
    │   ├── login.html
    │   ├── play.html
    │   ├── register.html
    │   └── top_users.html
    ├── middleware/  # routing middleware
    │   └── auth.js
    ├── app.js
    ├── routes.js  # backend routing handlers
    ├── routes.test.js
    ├── server.js
    ├── config.js  # project configurable variables
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

- Players can select different difficulties by choosing the number digits in the combinations as well as the number of attempts
- Players can optionally signup for an account to enroll in top 10 players billboard with highest wins
