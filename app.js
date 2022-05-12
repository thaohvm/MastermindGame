const bodyParser = require("body-parser");
const express = require("express");
const nunjucks = require("nunjucks");
const path = require("path");

const config = require('./config');
const { ExpressError } = require('./error');
const routes = require('./routes');

const app = express();

app.use(express.json());

app.use(express.static(path.join(__dirname, "static")));

// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure("templates", {
    autoescape: true,
    express: app
});

// Apply a prefix to every route in userRoutes
app.use("/", routes);

// 404 handler
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});

module.exports = app;
