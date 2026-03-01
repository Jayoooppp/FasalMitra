// AI Controller — proxies requests to Claude API server-side
// This keeps the Anthropic API key secure on the backend

exports.chat = async (req, res) => {
    try {
        const { messages, system } = req.body;
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'AI service not configured. Set ANTHROPIC_API_KEY in .env' });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 600,
                system: system || '',
                messages: messages || []
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('AI chat error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};

exports.diagnose = async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'AI service not configured' });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: messages || []
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('AI diagnose error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};

exports.cropRecommendation = async (req, res) => {
    try {
        const { messages } = req.body;
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: 'AI service not configured' });
        }

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1200,
                messages: messages || []
            })
        });

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('AI crop error:', error.message);
        res.status(500).json({ error: 'AI service error' });
    }
};
