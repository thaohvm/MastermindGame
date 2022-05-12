const { Client } = require("pg");

const config = require('./config');

const client = new Client(config.db.DB_URI);

client.connect();

module.exports = client;
