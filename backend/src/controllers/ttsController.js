/**
 * Text-to-Speech Controller (Polly)
 * 
 * Endpoints for converting text to speech audio.
 * Works with AWS Polly provider only (no-op for local).
 */

const providers = require('../providers');

// POST /api/v2/tts/synthesize
// Body: { text: "Apply fertilizer today", language: "hi" }
exports.synthesize = async (req, res, next) => {
    try {
        const { text, language, voiceId, format } = req.body;
        if (!text) return res.status(400).json({ error: 'Text is required' });

        if (providers.name !== 'aws') {
            return res.status(501).json({ error: 'Text-to-speech is only available with AWS provider' });
        }

        const result = await providers.tts.synthesize(text, {
            language: language || 'en',
            voiceId,
            format: format || 'mp3',
        });

        res.set({
            'Content-Type': result.contentType,
            'Content-Length': result.audioStream.length,
        });
        res.send(result.audioStream);
    } catch (error) {
        console.error('TTS error:', error.message);
        next(error);
    }
};

// GET /api/v2/tts/voices?language=hi-IN
exports.listVoices = async (req, res, next) => {
    try {
        if (providers.name !== 'aws') {
            return res.status(501).json({ error: 'Voice listing is only available with AWS provider' });
        }

        const languageCode = req.query.language || 'en-IN';
        const voices = await providers.tts.listVoices(languageCode);
        res.json({ voices });
    } catch (error) {
        next(error);
    }
};
