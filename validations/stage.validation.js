const Joi = require("joi");

exports.stageValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  });
  return schema.validate(body);
};
