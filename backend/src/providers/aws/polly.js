/**
 * AWS Polly Text-to-Speech Provider
 * 
 * Converts text to speech audio. Useful for farmers who prefer voice guidance.
 * Supports Hindi and English voices (Indian accents).
 * 
 * Voices:
 *   - English (India): Aditi (standard), Kajal (neural)
 *   - Hindi: Aditi (standard), Kajal (neural)
 */

function getClient() {
    const { getPollyClient } = require('../../config/aws');
    return getPollyClient();
}

/**
 * Synthesize text into speech audio
 * @param {string} text - Text to convert to speech
 * @param {object} options
 * @param {string} options.language - 'en' | 'hi' | 'mr' (default: 'en')
 * @param {string} options.voiceId - Polly voice ID (default: 'Kajal')
 * @param {string} options.format - 'mp3' | 'ogg_vorbis' | 'pcm' (default: 'mp3')
 * @param {string} options.engine - 'standard' | 'neural' | 'generative' (default: 'neural')
 * @returns {{ audioStream: Buffer, contentType: string }}
 */
async function synthesize(text, options = {}) {
    const { SynthesizeSpeechCommand } = require('@aws-sdk/client-polly');
    const client = getClient();

    // Map app languages to Polly language codes and voices
    const languageMap = {
        'en': { LanguageCode: 'en-IN', VoiceId: 'Kajal' },
        'hi': { LanguageCode: 'hi-IN', VoiceId: 'Kajal' },
        'mr': { LanguageCode: 'hi-IN', VoiceId: 'Kajal' }, // Marathi falls back to Hindi
        'English': { LanguageCode: 'en-IN', VoiceId: 'Kajal' },
        'Hindi': { LanguageCode: 'hi-IN', VoiceId: 'Kajal' },
        'Marathi': { LanguageCode: 'hi-IN', VoiceId: 'Kajal' },
    };

    const langConfig = languageMap[options.language] || languageMap['en'];

    const params = {
        Text: text,
        OutputFormat: options.format || 'mp3',
        VoiceId: options.voiceId || langConfig.VoiceId,
        LanguageCode: langConfig.LanguageCode,
        Engine: options.engine || 'neural',
    };

    // If text contains SSML tags, set TextType
    if (text.includes('<speak>')) {
        params.TextType = 'ssml';
    }

    const result = await client.send(new SynthesizeSpeechCommand(params));

    // Convert the readable stream to a buffer
    const chunks = [];
    for await (const chunk of result.AudioStream) {
        chunks.push(chunk);
    }
    const audioBuffer = Buffer.concat(chunks);

    const contentTypeMap = {
        'mp3': 'audio/mpeg',
        'ogg_vorbis': 'audio/ogg',
        'pcm': 'audio/pcm',
    };

    return {
        audioStream: audioBuffer,
        contentType: contentTypeMap[params.OutputFormat] || 'audio/mpeg',
    };
}

/**
 * Get list of available voices for a language
 */
async function listVoices(languageCode = 'en-IN') {
    const { DescribeVoicesCommand } = require('@aws-sdk/client-polly');
    const client = getClient();

    const result = await client.send(new DescribeVoicesCommand({
        LanguageCode: languageCode,
    }));

    return (result.Voices || []).map(v => ({
        id: v.Id,
        name: v.Name,
        gender: v.Gender,
        engine: v.SupportedEngines,
        languageCode: v.LanguageCode,
    }));
}

module.exports = {
    synthesize,
    listVoices,
};
