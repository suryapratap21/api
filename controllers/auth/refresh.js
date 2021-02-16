const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const Token = require("../../models/Token.model");
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
  // console.log(req.headers);
  // check if refresh token is passed in request header
  if (!req.headers["refreshtoken"]) return next(createError.Unauthorized());

  const token = req.headers["refreshtoken"];
  // console.log("token", token);
  jwt.verify(token, refreshSecret, (err, payload) => {
    if (err) {
      const message =
        err.name === "JsonWebTokenError" ? "Unauthorized" : err.message;
      return next(createError.Unauthorized(message));
    }
    // console.log("inside verify");

    Token.findOne({ _userId: payload.id }).then((resultQuery) => {
      if (resultQuery === null) {
        return next(createError.Unauthorized());
      } else {
        // console.log("inside generate new token if condition");
        if (resultQuery.token === token) {
          // console.log("if token matches with the database one");
          const accessToken = generateAccessToken(
            { id: payload.id },
            accessTokenLife
          );
          const refreshToken = generateRefreshToken(
            { id: payload.id },
            refreshTokenLife
          );
          if (accessToken && refreshToken) {
            // console.log("before writing to db the new token");
            resultQuery.overwrite(
              new Token({
                _userId: payload.id,
                token: refreshToken,
              })
            );
            // console.log("before result.save");
            resultQuery.save();
            // console.log("after result.save");
            res.status(200).json({
              success: true,
              accessToken,
              refreshToken,
            });
          }
        } else {
          return next(createError.Unauthorized());
        }
      }
    });
  });
};

module.exports = refreshTokens;
