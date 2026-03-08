/**
 * Provider Factory
 * 
 * Switches between 'local' (existing MongoDB/JWT/Gemini stack) and 'aws' 
 * (DynamoDB/Cognito/Bedrock) based on the PROVIDER environment variable.
 * 
 * Usage in controllers:
 *   const { db, auth, ai, storage, tts } = require('../providers');
 */

const PROVIDER = (process.env.PROVIDER || 'local').toLowerCase();

let providers;

if (PROVIDER === 'aws') {
    console.log('🔶 Using AWS provider stack (DynamoDB, Cognito, Bedrock, S3, Polly)');
    providers = {
        db: require('./aws/dynamodb'),
        auth: require('./aws/cognito'),
        ai: require('./aws/bedrock'),
        storage: require('./aws/s3'),
        tts: require('./aws/polly'),
        name: 'aws',
    };
} else {
    console.log('🟢 Using local provider stack (MongoDB, JWT, Gemini)');
    providers = {
        db: require('./local/db'),
        auth: require('./local/auth'),
        ai: require('./local/ai'),
        storage: { upload: async () => ({ url: '' }), getSignedUrl: async () => '' },  // no-op for local
        tts: { synthesize: async () => Buffer.alloc(0) },  // no-op for local
        name: 'local',
    };
}

module.exports = providers;
