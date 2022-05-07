const express = require('express');
const nunjucks = require("nunjucks");
const bodyParser = require("body-parser");
const ExpressError = require('./expressError');
const routes = require('./routes');
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

app.use("/", routes);

// 404 handler
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
});

// generic error handler
// app.use((err, req, res, next) => {
//     res.status(err.status || 500);

//     return res.render("error.html", { err });
// });

app.listen(3000, function () {
    console.log("Server running on port 3000")
})
