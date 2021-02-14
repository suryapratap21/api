const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../../models/User.model");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../../services/generate_token");
const { loginValidation } = require("../../services/validation_schema");
const { accessTokenLife, refreshTokenLife } = require("../../config/keys").jwt;

const loginUser = async (req, res, next) => {
  try {
    // validation check of credentials
    const result = await loginValidation.validateAsync(req.body);
    const { email, password } = result;

    // Check if email is registered
    User.findOne({ email }).then((user) => {
      if (!user) {
        return createError.NotFound(
          "This email is not registered. Please register"
        );
      }

      // Compare password with saved password
      bcrypt.compare(password, user.password).then((isMatch) => {
        if (!isMatch) {
          return createError.Unauthorized("The email/password is incorrect");
        }
        const payload = {
          id: user._id,
        };
        const accessToken = generateAccessToken(payload, accessTokenLife);
        const refreshToken = generateRefreshToken(payload, refreshTokenLife);
        if (accessToken && refreshToken)
          res.status(200).json({
            success: true,
            accessToken,
            refreshToken,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
            },
          });
      });
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = loginUser;
