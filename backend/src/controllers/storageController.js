/**
 * Storage Controller (S3)
 * 
 * Endpoints for image upload, presigned URL generation, and file listing.
 * Works with both local (no-op) and AWS (S3) providers.
 */

const providers = require('../providers');
const { v4: uuidv4 } = require('uuid');

// POST /api/v2/storage/upload
// Body: { data: base64String, contentType: 'image/jpeg', folder: 'disease' }
exports.upload = async (req, res, next) => {
    try {
        const { data, contentType, folder } = req.body;
        if (!data) return res.status(400).json({ error: 'Image data is required' });

        const ext = (contentType || 'image/jpeg').split('/')[1] || 'jpg';
        const key = `${folder || 'uploads'}/${req.userId}/${uuidv4()}.${ext}`;

        const result = await providers.storage.upload(data, key, contentType || 'image/jpeg', true);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// GET /api/v2/storage/presigned-url?key=images/photo.jpg&contentType=image/jpeg
exports.getPresignedUrl = async (req, res, next) => {
    try {
        const { key, contentType } = req.query;
        if (!key) return res.status(400).json({ error: 'Key is required' });

        const url = await providers.storage.getPresignedUploadUrl(key, contentType || 'image/jpeg');
        res.json({ url, key });
    } catch (error) {
        next(error);
    }
};

// GET /api/v2/storage/signed-url?key=images/photo.jpg
exports.getSignedUrl = async (req, res, next) => {
    try {
        const { key } = req.query;
        if (!key) return res.status(400).json({ error: 'Key is required' });

        const url = await providers.storage.getSignedUrl(key);
        res.json({ url });
    } catch (error) {
        next(error);
    }
};

// GET /api/v2/storage/list?prefix=disease/userId
exports.list = async (req, res, next) => {
    try {
        const prefix = req.query.prefix || `uploads/${req.userId}/`;
        const files = await providers.storage.listObjects(prefix);
        res.json({ files });
    } catch (error) {
        next(error);
    }
};
