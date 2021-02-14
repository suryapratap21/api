const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { secret } = require("../config/keys").jwt;

const generateToken = (payload, expiresIn) => {
  const token = jwt.sign(payload, secret, { expiresIn });
  if (!token) return createError();
  return token;
};

module.exports = generateToken;
