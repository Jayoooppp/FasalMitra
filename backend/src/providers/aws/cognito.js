/**
 * AWS Cognito Auth Provider
 * 
 * Replaces JWT + bcrypt auth with Amazon Cognito.
 * Supports user registration, login, and token verification.
 * 
 * Requires:
 *   - AWS_COGNITO_USER_POOL_ID
 *   - AWS_COGNITO_CLIENT_ID
 */

const USER_POOL_ID = () => process.env.AWS_COGNITO_USER_POOL_ID;
const CLIENT_ID = () => process.env.AWS_COGNITO_CLIENT_ID;

function getCognitoClient() {
    const { getCognitoClient: getClient } = require('../../config/aws');
    return getClient();
}

/**
 * Register a new user in Cognito
 */
async function signUp(email, password, attributes = {}) {
    const { SignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const client = getCognitoClient();

    const userAttributes = [
        { Name: 'email', Value: email },
    ];

    if (attributes.name) userAttributes.push({ Name: 'name', Value: attributes.name });
    if (attributes.phone) userAttributes.push({ Name: 'phone_number', Value: attributes.phone });

    // Add custom attributes for farm-specific data
    if (attributes.location) userAttributes.push({ Name: 'custom:location', Value: attributes.location });
    if (attributes.farmSize) userAttributes.push({ Name: 'custom:farmSize', Value: String(attributes.farmSize) });
    if (attributes.soilType) userAttributes.push({ Name: 'custom:soilType', Value: attributes.soilType });

    const result = await client.send(new SignUpCommand({
        ClientId: CLIENT_ID(),
        Username: email,
        Password: password,
        UserAttributes: userAttributes,
    }));

    return {
        userId: result.UserSub,
        confirmed: result.UserConfirmed,
    };
}

/**
 * Auto-confirm user (for development — in prod, use email/SMS verification)
 */
async function adminConfirmUser(email) {
    const { AdminConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const client = getCognitoClient();

    await client.send(new AdminConfirmSignUpCommand({
        UserPoolId: USER_POOL_ID(),
        Username: email,
    }));
}

/**
 * Sign in — returns Cognito tokens
 */
async function signIn(email, password) {
    const { InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const client = getCognitoClient();

    const result = await client.send(new InitiateAuthCommand({
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: CLIENT_ID(),
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    }));

    return {
        accessToken: result.AuthenticationResult.AccessToken,
        idToken: result.AuthenticationResult.IdToken,
        refreshToken: result.AuthenticationResult.RefreshToken,
        expiresIn: result.AuthenticationResult.ExpiresIn,
    };
}

/**
 * Generate token — for Cognito, tokens come from signIn, this wraps it
 */
function generateToken(userId) {
    // With Cognito, the token is returned by signIn.
    // This is a compatibility shim; the actual token handling happens in signIn.
    return userId; // placeholder — controllers use signIn result directly
}

/**
 * Verify the Cognito access token
 */
async function verifyToken(token) {
    const { GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
    const client = getCognitoClient();

    const result = await client.send(new GetUserCommand({
        AccessToken: token,
    }));

    const attrs = {};
    for (const attr of result.UserAttributes) {
        attrs[attr.Name] = attr.Value;
    }

    return {
        id: attrs.sub,
        email: attrs.email,
        name: attrs.name || '',
    };
}

/**
 * Authenticate middleware — verifies Cognito token, loads user from DynamoDB
 */
async function authenticate(req, res, next) {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = await verifyToken(token);
        const db = require('../aws/dynamodb');
        const user = await db.findUserById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Invalid token. User not found.' });
        }

        req.user = user;
        req.userId = user.userId || user._id;
        next();
    } catch (error) {
        console.error('Cognito auth error:', error.message);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
}

module.exports = {
    signUp,
    adminConfirmUser,
    signIn,
    generateToken,
    verifyToken,
    authenticate,
};
