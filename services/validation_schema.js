const Joi = require("joi");

const registerValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  name: Joi.string().min(3).max(255).required(),
  password: Joi.string().alphanum().min(2).required(),
  role: Joi.string().allow("CUSTOMER", "STORE_MANAGER"),
});

const loginValidation = Joi.object({
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().alphanum().min(2).required(),
});

module.exports = { registerValidation, loginValidation };
