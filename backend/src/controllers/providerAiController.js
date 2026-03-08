/**
 * Provider-Aware AI Controller
 * 
 * Uses the provider system to switch between local (Gemini) 
 * and AWS (Bedrock) AI transparently.
 */

const providers = require('../providers');

// POST /api/v2/ai/chat
exports.chat = async (req, res) => {
    try {
        const { messages, system } = req.body;
        const text = await providers.ai.chat(messages, system);
        res.json({ content: [{ text }] });
    } catch (error) {
        console.error('AI chat error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};

// POST /api/v2/ai/diagnose
exports.diagnose = async (req, res) => {
    try {
        const { messages, system } = req.body;
        const text = await providers.ai.diagnose(messages, system);
        res.json({ content: [{ text }] });
    } catch (error) {
        console.error('AI diagnose error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};

// POST /api/v2/ai/crop
exports.cropRecommendation = async (req, res) => {
    try {
        const { messages, system } = req.body;
        const text = await providers.ai.cropRecommendation(messages, system);
        res.json({ content: [{ text }] });
    } catch (error) {
        console.error('AI crop error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};
