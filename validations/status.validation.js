const Joi = require("joi");

exports.statusValidation = (body) => {
  const schema = Joi.object({
    status: Joi.string().required(),
  });
  return schema.validate(body);
};
