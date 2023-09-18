'use strict';

/**
 * location router
 */
const { createCoreRouter } = require('@strapi/strapi').factories;
const { rateLimit } = require("express-rate-limit");

// rate limiting
const fiveReqLimits = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day,
    max: 5, // 5 requests,
    // get ip address of user since it is required
    keyGenerator: (request, response) => { let ip = strapi.requestContext.get().request.ip; return ip },
    handler: async (request, response, next) => {
        const ctx = strapi.requestContext.get();
        ctx.status = 403;
        ctx.body = {
            message: "You have exhausted your 5 requests for the day. Please check back tomorrow.",
            policy: "rate-limit"
        }
    },
})

const tenReqLimits = rateLimit({
    windowMs: 24 * 60 * 60 * 1000, // 1 day,
    max: 10, // 10 requests,
    keyGenerator: (request, response) => { let ip = strapi.requestContext.get().request.ip; return ip },
    handler: async (request, response, next) => {
        const ctx = strapi.requestContext.get();
        ctx.status = 403;
        ctx.body = {
            message: "You have exhausted your 10 requests for the day. Please check back tomorrow.",
            policy: "rate-limit"
        }
    },
})

module.exports = createCoreRouter('api::location.location', {
    config: {
        find: {
            middlewares: [
                async (ctx, next) => {
                    const ip = ctx.request.ip;
                    if (ctx.state.user.plan === "basic") {
                        fiveReqLimits(ctx.req, ctx.res, (error) => {
                            if (error) {
                                ctx.status = 500;
                                ctx.body = { error: error.message }
                            }
                        });
                    } else {
                        tenReqLimits(ctx.req, ctx.res, (error) => {
                            if (error) {
                                ctx.status = 500;
                                ctx.body = { error: error.message }
                            }
                        });
                    }
                    await next();
                },
            ],
            policies: ["global::consent", "global::account-locked", "ip", "rate-limit"],
        },
        create: {
            policies: ["location-input"]
        },
        update: {
            policies: ["is-admin"]
        }
    }
});
