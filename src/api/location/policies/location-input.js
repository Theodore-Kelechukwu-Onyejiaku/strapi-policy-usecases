const { errors } = require("@strapi/utils")
const { PolicyError } = errors;
const Joi = require("joi");

const schema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    address: Joi.string()
        .min(5)
        .max(100)
        .required()
})

module.exports = async (policyContext, config, { strapi }) => {
    const { data } = policyContext.request.body;
    const validationError = schema.validate(data)?.error?.details[0]?.message
    if (validationError) {
        throw new PolicyError(validationError, {
            policy: 'location-creation',
        });
    }
    return true
};