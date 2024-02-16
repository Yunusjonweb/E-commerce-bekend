const Joi = require("joi");

module.exports = function CategoryValidation(data) {
  return Joi.object({
    category_name: Joi.string().required(),
  }).validateAsync(data);
};
