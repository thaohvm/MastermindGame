const jwt = require("jsonwebtoken");
const config = require("../config");

function authenticateJWT(req, res, next) {
  try {
    const tokenFromBody = req.body._token;
    const payload = jwt.verify(tokenFromBody, config.db.SECRET_KEY);
    req.user = payload; // create a current user
    return next();
  } catch (err) {
    return next();
  }
}

module.exports = {
  authenticateJWT,
};
