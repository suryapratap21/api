const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { secret } = require("../config/keys").jwt;

const verifyAccessToken = (req, res, next) => {
  // check if access token is passed in request header
  if (!req.headers["authorization"]) return next(createError.Unauthorized());

  const authHeader = req.headers["authorization"];
  const bearerToken = authHeader.split(" ");
  const token = bearerToken[1];
  jwt.verify(token, secret, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

module.exports = verifyAccessToken;
