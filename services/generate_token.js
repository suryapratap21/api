const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const { accessSecret, refreshSecret } = require("../config/keys").jwt;

const generateAccessToken = (payload, expiresIn) => {
  const token = jwt.sign(payload, accessSecret, { expiresIn });
  if (!token) return createError();
  return token;
};

const generateRefreshToken = (payload, expiresIn) => {
  const token = jwt.sign(payload, refreshSecret, { expiresIn });
  if (!token) return createError();
  return token;
};

module.exports = { generateAccessToken, generateRefreshToken };
