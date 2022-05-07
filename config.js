var config = {};

config.combination = {};
config.game = {};

config.combination.baseUrl = process.env.COMBINATION_BASE_URL || "https://www.random.org/integers"
config.combination.numDigits = process.env.COMBINATION_NUM_DIGITS || 4;
config.combination.min = process.env.COMBINATION_MIN || 0;
config.combination.max = process.env.COMBINATION_MAX || 7;

module.exports = config;
