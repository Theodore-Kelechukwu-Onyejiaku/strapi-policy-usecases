const { errors } = require("@strapi/utils")
const { PolicyError } = errors;

module.exports = async (policyContext, config, { strapi }) => {
    if (policyContext.state.user.agreeToPolicy) {
        return true
    } else {
        const user = policyContext.state.user.username;
        throw new PolicyError(`Hi ${user}, Please agree to terms and conditions to continue.`, {
            policy: 'consent-policy',
        });
    }
};