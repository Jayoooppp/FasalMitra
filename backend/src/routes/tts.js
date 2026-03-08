/**
 * Text-to-Speech Routes (Polly)
 */
const express = require('express');
const providerAuth = require('../middleware/providerAuth');
const { synthesize, listVoices } = require('../controllers/ttsController');
const router = express.Router();

router.post('/synthesize', providerAuth, synthesize);
router.get('/voices', providerAuth, listVoices);

module.exports = router;
