const Joi = require('@hapi/joi');

const ingredientSchema = Joi.object({
  name: Joi.string().required(),
  amount: Joi.number().required(),
});

module.exports = { ingredientSchema };
