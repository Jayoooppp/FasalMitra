/**
 * Storage Routes (S3)
 */
const express = require('express');
const providerAuth = require('../middleware/providerAuth');
const { upload, getPresignedUrl, getSignedUrl, list } = require('../controllers/storageController');
const router = express.Router();

router.post('/upload', providerAuth, upload);
router.get('/presigned-url', providerAuth, getPresignedUrl);
router.get('/signed-url', providerAuth, getSignedUrl);
router.get('/list', providerAuth, list);

module.exports = router;
