const Joi = require("joi");

module.exports = function LoginValidation(data) {
  return Joi.object({
    email: Joi.string().required(),
    password: Joi.string().min(6).required(),
  }).validateAsync(data);
};
