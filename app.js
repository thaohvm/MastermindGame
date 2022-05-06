const express = require('express');
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const ExpressError = require('./expressError');
const mastermindRoutes = require('./mastermindRoutes');
const app = express();

app.use(express.json());

// serve your css as static
app.use(express.static(__dirname));

// Parse body for urlencoded (non-JSON) data
app.use(bodyParser.urlencoded({ extended: false }));

nunjucks.configure("templates", {
  autoescape: true,
  express: app
});

//  apply a prefix to every route in userRoutes

app.use("/mastermind", mastermindRoutes);

// 404 handler
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});

// generic error handler
app.use(function (err, req, res, next) {
    // the default status is 500 Internal Server Error
    let status = err.status || 500;
    let message = err.message;

    // set the status and alert the user
    return res.status(status).json({
        error: { message, status }
    });
});

app.listen(3000, function () {
    console.log("Server running on port 3000")
})
