const config = require('../config');

const { Client } = require("pg");

const client = new Client(config.db.DB_URI);

client.connect();

module.exports = client;
