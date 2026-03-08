/**
 * V2 AI Routes — uses provider-aware controllers
 */
const express = require('express');
const { chat, diagnose, cropRecommendation } = require('../controllers/providerAiController');
const router = express.Router();

router.post('/chat', chat);
router.post('/diagnose', diagnose);
router.post('/crop', cropRecommendation);

module.exports = router;
