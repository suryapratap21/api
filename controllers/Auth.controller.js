const bcrypt = require("bcryptjs");
const createError = require("http-errors");

// import models and helpers
const User = require("../models/User.model");
const registerValidation = require("../services/validation_schema");

const registerUser = async (req, res, next) => {
  const { email, name, password, role } = req.body;

  // validation code here
  try {
    const result = await registerValidation.validateAsync(req.body);

    // check for already registeration of user
    User.findOne({ email: result.email }, async (err, existingUser) => {
      if (err) next(err);
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
            email,
            name,
            password: hash,
            role,
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
            res.send("the user is" + user);
          });
        });
      });
    });
  } catch (error) {
    if (error.isJoi === true) error.status = 422;
    return next(error);
  }
};

module.exports = registerUser;
