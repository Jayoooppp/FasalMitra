const express = require('express');
const { getPrices, getPriceHistory, getNearbyMarkets } = require('../controllers/marketController');
const router = express.Router();

router.get('/prices', getPrices);
router.get('/prices/:crop/history', getPriceHistory);
router.get('/markets', getNearbyMarkets);

module.exports = router;
