const Joi = require("joi");

exports.branchValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    call_number: Joi.string()
      .pattern(/^\+?\d{7,15}$/)
      .required(),
  });
  return schema.validate(body);
};
