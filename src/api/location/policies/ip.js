const { errors } = require("@strapi/utils")
const { PolicyError } = errors;
const ip = require('koa-ip')

const blackList =
    [
        '77.88.99.1',
        '88.77.99.1',
        '127.0.0.1'
    ];

module.exports = async (policyContext, config, { strapi }) => {
    const ip = policyContext.request.ip;
    if (blackList.indexOf(ip) > -1) {
        const user = policyContext.state.user.username;
        throw new PolicyError(`Hi ${user} Please this resource is not available to you`, {
            policy: 'ip-blacklist',
        });
    } else {
        return true
    }
};