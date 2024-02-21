const Joi = require("joi");

module.exports = function CategoryValidation(data) {
  return Joi.object({
    key: Joi.string().required(),
    value: Joi.string().required(),
  }).validateAsync(data);
};
