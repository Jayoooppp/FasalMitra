/**
 * AWS Bedrock AI Provider
 * 
 * Replaces Google Gemini with Amazon Bedrock for all AI operations.
 * Uses Claude 3 Sonnet by default (configurable via AWS_BEDROCK_MODEL_ID).
 * 
 * Supports:
 *   - Multi-turn chat
 *   - Image + text diagnosis
 *   - Crop recommendations
 */

const MODEL_ID = () => process.env.AWS_BEDROCK_MODEL_ID || 'anthropic.claude-3-sonnet-20240229-v1:0';

function getClient() {
    const { getBedrockClient } = require('../../config/aws');
    return getBedrockClient();
}

/**
 * Invoke Bedrock model with messages in Anthropic Claude format
 */
async function invokeModel(messages, systemPrompt, maxTokens = 4096) {
    const { InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
    const client = getClient();

    const body = {
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: maxTokens,
        messages,
    };

    if (systemPrompt) {
        body.system = systemPrompt;
    }

    const result = await client.send(new InvokeModelCommand({
        modelId: MODEL_ID(),
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(body),
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(result.body));
    return responseBody.content[0].text;
}

/**
 * Chat completion — multi-turn conversation
 */
async function chat(messages, systemPrompt) {
    // Convert from {role, content} to Bedrock Claude format
    const bedrockMessages = messages.map(m => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: [{ type: 'text', text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
    }));

    return invokeModel(bedrockMessages, systemPrompt);
}

/**
 * Diagnose — image + text analysis
 */
async function diagnose(messages, systemPrompt) {
    const userMsg = messages[0];
    const content = [];

    if (Array.isArray(userMsg.content)) {
        for (const item of userMsg.content) {
            if (item.type === 'image') {
                content.push({
                    type: 'image',
                    source: {
                        type: 'base64',
                        media_type: item.source.media_type,
                        data: item.source.data,
                    },
                });
            } else if (item.type === 'text') {
                content.push({ type: 'text', text: item.text });
            }
        }
    } else {
        content.push({ type: 'text', text: userMsg.content });
    }

    const bedrockMessages = [{ role: 'user', content }];
    return invokeModel(bedrockMessages, systemPrompt);
}

/**
 * Crop recommendation — same interface as chat
 */
async function cropRecommendation(messages, systemPrompt) {
    return chat(messages, systemPrompt);
}

module.exports = {
    chat,
    diagnose,
    cropRecommendation,
};
