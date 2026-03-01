const express = require('express');
const { getRecommendation } = require('../controllers/cropController');
const router = express.Router();

router.post('/recommend', getRecommendation);

module.exports = router;
