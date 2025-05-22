const Joi = require("joi");

exports.roleValidation = (body) => {
  const schema = Joi.object({
    name: Joi.string().required(),
  });
  return schema.validate(body);
};
