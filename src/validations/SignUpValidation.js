const Joi = require("joi");

module.exports = function SignUpValidation(data) {
  return Joi.object({
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    username: Joi.string().min(4).max(30).required(),
    password: Joi.string().min(6).required(),
  }).validateAsync(data);
};
