require("dotenv").config();
var config = {};

config.combination = {};
config.game = {};
config.db = {};

config.PORT = process.env.PORT || 3000;

config.combination.BASE_URL = process.env.COMBINATION_BASE_URL || "https://www.random.org/integers"

config.game.NUM_ATTEMPTS = process.env.GAME_NUM_ATTEMPTS || 10;
config.game.NUM_DIGITS = process.env.GAME_NUM_DIGITS || 4;
config.game.MIN = process.env.GAME_MIN || 0;
config.game.MAX = process.env.GAME_MAX || 7;

config.db.DB_URI = process.env.DB_URI || "postgresql:///mastermind_test";
config.db.SECRET_KEY = process.env.SECRET_KEY || "secret";
config.db.BCRYPT_WORK_FACTOR = 12;

module.exports = config;
