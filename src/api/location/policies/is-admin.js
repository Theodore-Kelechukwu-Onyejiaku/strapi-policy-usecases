const { errors } = require("@strapi/utils")
const { PolicyError } = errors;

module.exports = async (policyContext, config, { strapi }) => {
    // check if user is admin
    if (policyContext.state.user.isAdmin) {
        // Go to controller's action.
        return true;
    }
    // if not admin block request
    const user = policyContext.state.user.username;
    throw new PolicyError(`Hi ${user}, you are not allowed to update this data`, {
        policy: 'admin-policy',
    });
};