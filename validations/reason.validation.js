const Joi = require("joi");

exports.reasonValidation = (body) => {
  const schema = Joi.object({
    reason_lid: Joi.string().required(),
  });
  return schema.validate(body);
};

