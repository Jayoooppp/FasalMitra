const express = require('express');
const { chat, diagnose, cropRecommendation } = require('../controllers/aiController');
const router = express.Router();

router.post('/chat', chat);
router.post('/diagnose', diagnose);
router.post('/crop', cropRecommendation);

module.exports = router;
