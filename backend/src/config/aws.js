/**
 * AWS SDK Configuration
 * Centralizes AWS client initialization for all services.
 * Only loaded when PROVIDER=aws
 */

const awsConfig = {
    region: process.env.AWS_REGION || 'ap-south-1',
    credentials: process.env.AWS_ACCESS_KEY_ID ? {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    } : undefined, // Falls back to default credential chain (IAM role, env, shared config)
};

// Lazy-loaded clients (only created when first used)
let _dynamoDBClient = null;
let _cognitoClient = null;
let _bedrockClient = null;
let _s3Client = null;
let _pollyClient = null;

function getDynamoDBClient() {
    if (!_dynamoDBClient) {
        const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
        _dynamoDBClient = new DynamoDBClient(awsConfig);
    }
    return _dynamoDBClient;
}

function getDynamoDBDocClient() {
    const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
    return DynamoDBDocumentClient.from(getDynamoDBClient(), {
        marshallOptions: { removeUndefinedValues: true },
    });
}

function getCognitoClient() {
    if (!_cognitoClient) {
        const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');
        _cognitoClient = new CognitoIdentityProviderClient(awsConfig);
    }
    return _cognitoClient;
}

function getBedrockClient() {
    if (!_bedrockClient) {
        const { BedrockRuntimeClient } = require('@aws-sdk/client-bedrock-runtime');
        _bedrockClient = new BedrockRuntimeClient(awsConfig);
    }
    return _bedrockClient;
}

function getS3Client() {
    if (!_s3Client) {
        const { S3Client } = require('@aws-sdk/client-s3');
        _s3Client = new S3Client(awsConfig);
    }
    return _s3Client;
}

function getPollyClient() {
    if (!_pollyClient) {
        const { PollyClient } = require('@aws-sdk/client-polly');
        _pollyClient = new PollyClient(awsConfig);
    }
    return _pollyClient;
}

module.exports = {
    awsConfig,
    getDynamoDBClient,
    getDynamoDBDocClient,
    getCognitoClient,
    getBedrockClient,
    getS3Client,
    getPollyClient,
};
