const Joi = require("joi");

module.exports = function OrderValidation(data) {
  return Joi.object({
    full_name: Joi.string().required(),
    shopping_region: Joi.string().required(),
    shopping_address: Joi.string().required(),
    phone: Joi.string().required(),
    comment: Joi.string().required(),
  }).validateAsync(data);
};
