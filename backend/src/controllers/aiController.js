// AI Controller — proxies requests to Google Gemini API server-side
// This keeps the Gemini API key secure on the backend

const { GoogleGenerativeAI } = require('@google/generative-ai');

function getGenAI() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenerativeAI(apiKey);
}

exports.chat = async (req, res) => {
    try {
        const { messages, system } = req.body;
        const genAI = getGenAI();
        if (!genAI) {
            return res.status(500).json({ error: 'AI service not configured. Set GEMINI_API_KEY in .env' });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: system || undefined,
        });

        // Convert messages from [{role, content}] to Gemini history + last user message
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
        const text = result.response.text();

        // Return in a normalized format matching what the frontend expects
        res.json({ content: [{ text }] });
    } catch (error) {
        console.error('AI chat error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};

exports.diagnose = async (req, res) => {
    try {
        const { messages, system } = req.body;
        const genAI = getGenAI();
        if (!genAI) {
            return res.status(500).json({ error: 'AI service not configured. Set GEMINI_API_KEY in .env' });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: system || undefined,
        });

        // The diagnose endpoint receives a single user message with image + text
        // Convert from Anthropic content format to Gemini parts format
        const userMsg = messages[0];
        const parts = [];

        if (Array.isArray(userMsg.content)) {
            for (const item of userMsg.content) {
                if (item.type === 'image') {
                    parts.push({
                        inlineData: {
                            mimeType: item.source.media_type,
                            data: item.source.data,
                        }
                    });
                } else if (item.type === 'text') {
                    parts.push({ text: item.text });
                }
            }
        } else {
            parts.push({ text: userMsg.content });
        }

        const result = await model.generateContent(parts);
        const text = result.response.text();

        res.json({ content: [{ text }] });
    } catch (error) {
        console.error('AI diagnose error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};

exports.cropRecommendation = async (req, res) => {
    try {
        const { messages, system } = req.body;
        const genAI = getGenAI();
        if (!genAI) {
            return res.status(500).json({ error: 'AI service not configured. Set GEMINI_API_KEY in .env' });
        }

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.0-flash',
            systemInstruction: system || undefined,
        });

        // Convert messages to Gemini format
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
        const text = result.response.text();

        res.json({ content: [{ text }] });
    } catch (error) {
        console.error('AI crop error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};
