const { errors } = require("@strapi/utils")
const { PolicyError } = errors;
const { DateTime } = require("luxon")

module.exports = async (policyContext, config, { strapi }) => {
    const dateOfLockout = DateTime.fromISO(policyContext.state.user?.dateOfLockout);
    const luxonDateTime = DateTime.now();

    const daysDifference = luxonDateTime.diff(dateOfLockout, ["days"]).toObject()?.days

    // if lockout period has been exceeded
    if (daysDifference > 7) {
        return true
    } else {
        let daysRemaining = (dateOfLockout.day + 7) - luxonDateTime.day;
        const user = policyContext.state.user.username;

        throw new PolicyError(`Hi ${user}. Your account has been blocked. Check back in ${daysRemaining.toFixed()} days time`, {
            policy: 'account-locked',
        });
    }
};