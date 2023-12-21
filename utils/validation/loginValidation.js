const joi = require("joi");

const LoginSchema = joi.object({
  email: joi.string().empty().required().email().trim().messages({
    "string.empty": "email must be required",
    "any.required": " email must be required",
    "string.email": "invalid email address",
  }),
  password: joi.string().empty().min(6).required().trim().messages({
    "string.empty": "password must be required",
    "string.min": "password must be at least 6 charecters",
    "eny.required": "password must be required",
  }),
});

module.exports = LoginSchema;
