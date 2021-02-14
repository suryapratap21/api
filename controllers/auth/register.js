const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../../models/User.model");
const generateToken = require("../../services/generate_token");
const { registerValidation } = require("../../services/validation_schema");
const { tokenLife, secret } = require("../../config/keys").jwt;

const registerUser = async (req, res, next) => {
  try {
    // validation code here
    const result = await registerValidation.validateAsync(req.body);

    const { email, password, role, name } = result;

    // check for already registeration of user
    User.findOne({ email }, async (err, existingUser) => {
      if (existingUser) {
        return next(
          createError.Conflict(`${email} is already registered. Please login`)
        );
      }

      // this runs when user is new
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            return next(
              createError(
                400,
                "Your request could not be processed. Please try again after some time."
              )
            );
          }
          const user = new User({
            email: email,
            name: name,
            password: hash,
            role: role,
          });

          // save user to the database
          user.save(async (err, user) => {
            if (err) {
              console.log("inside duplicate error");
              return next(
                createError(
                  400,
                  "Your request could not be processed. Please try again after some time."
                )
              );
            }
            const payload = {
              id: user._id,
            };
            const token = generateToken(payload, tokenLife);
            if (token)
              res.status(200).json({
                success: true,
                token: `Bearer ${token}`,
                user: {
                  id: user._id,
                  name: name,
                  email: email,
                  role: role,
                },
              });
          });
        });
      });
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    next(error);
  }
};

module.exports = registerUser;
