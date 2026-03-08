/**
 * Local AI Provider — wrapper around existing Google Gemini integration.
 * Exposes a uniform interface that matches the AWS Bedrock provider.
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');

function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
}

module.exports = {
    /**
     * Chat completion — multi-turn conversation
     */
    async chat(messages, systemPrompt) {
        const genAI = getGenAI();
        if (!genAI) throw new Error('AI service not configured. Set GEMINI_API_KEY in .env');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: systemPrompt || undefined,
        });

        const geminiHistory = [];
        for (let i = 0; i < messages.length - 1; i++) {
            const m = messages[i];
            geminiHistory.push({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            });
        }

        const lastMsg = messages[messages.length - 1];
        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(lastMsg.content);
        return result.response.text();
    },

    /**
     * Diagnose — image + text analysis
     */
    async diagnose(messages, systemPrompt) {
        const genAI = getGenAI();
        if (!genAI) throw new Error('AI service not configured. Set GEMINI_API_KEY in .env');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: systemPrompt || undefined,
        });

        const userMsg = messages[0];
        const parts = [];

        if (Array.isArray(userMsg.content)) {
            for (const item of userMsg.content) {
                if (item.type === 'image') {
                    parts.push({
                        inlineData: {
                            mimeType: item.source.media_type,
                            data: item.source.data,
                        },
                    });
                } else if (item.type === 'text') {
                    parts.push({ text: item.text });
                }
            }
        } else {
            parts.push({ text: userMsg.content });
        }

        const result = await model.generateContent(parts);
        return result.response.text();
    },

    /**
     * Crop recommendation — same as chat but separate for clarity
     */
    async cropRecommendation(messages, systemPrompt) {
        const genAI = getGenAI();
        if (!genAI) throw new Error('AI service not configured. Set GEMINI_API_KEY in .env');

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: systemPrompt || undefined,
        });

        const geminiHistory = [];
        for (let i = 0; i < messages.length - 1; i++) {
            const m = messages[i];
            geminiHistory.push({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
            });
        }

        const lastMsg = messages[messages.length - 1];
        const chat = model.startChat({ history: geminiHistory });
        const result = await chat.sendMessage(
            typeof lastMsg.content === 'string' ? lastMsg.content : JSON.stringify(lastMsg.content)
        );
        return result.response.text();
    },
};
