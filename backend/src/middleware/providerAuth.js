/**
 * Provider-Aware Auth Middleware
 * 
 * Routes to the correct auth verification based on PROVIDER env.
 * - local: JWT verification + MongoDB user lookup
 * - aws: Cognito token verification + DynamoDB user lookup
 */

const providers = require('../providers');

const providerAuth = async (req, res, next) => {
    return providers.auth.authenticate(req, res, next);
};

module.exports = providerAuth;
