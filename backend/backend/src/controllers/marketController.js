const { marketPrices, priceHistory, nearbyMarkets } = require('../data/marketPrices');

exports.getPrices = (req, res) => {
    res.json({ prices: marketPrices, insight: 'Good time to sell Onion! Prices up ₹120 this week. Hold 40% for possible ₹200 more gain next week.' });
};

exports.getPriceHistory = (req, res) => {
    const { crop } = req.params;
    const history = priceHistory[crop];
    if (!history) return res.status(404).json({ error: 'No price history for this crop' });
    res.json({ crop, history });
};

exports.getNearbyMarkets = (req, res) => {
    res.json({ markets: nearbyMarkets });
};
