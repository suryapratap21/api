const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const {
  refreshSecret,
  accessTokenLife,
  refreshTokenLife,
} = require("../../config/keys").jwt;

const refreshTokens = (req, res, next) => {
  console.log(req.headers);
  // check if refresh token is passed in request header
  if (!req.headers["refreshtoken"]) return next(createError.Unauthorized());

  const token = req.headers["refreshtoken"];
  console.log("token", token);
  jwt.verify(token, refreshSecret, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    console.log("refresh", payload);
    // req.payload = payload;
    // next();
    const accessToken = generateAccessToken(
      { id: payload.id },
      accessTokenLife
    );
    const refreshToken = generateRefreshToken(
      { id: payload.id },
      refreshTokenLife
    );
    if (accessToken && refreshToken)
      res.status(200).json({
        success: true,
        accessToken,
        refreshToken,
      });
  });
};

module.exports = refreshTokens;
