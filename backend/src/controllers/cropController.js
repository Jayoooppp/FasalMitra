exports.getRecommendation = (req, res) => {
    // Returns a default recommendation; AI-powered version uses /api/ai/crop
    const { soil, season, farmSize, waterSource } = req.body;
    res.json({
        top_crops: [
            { name: 'Onion', emoji: '🧅', match_score: 96, duration_days: 120, yield_per_acre: '12-15 tonnes', estimated_income: '₹85,000', water_need: 'Medium', reasons: 'Black cotton soil and Rabi season are ideal for Onion in Nashik. Strong market demand and good yield history.', tip: 'Use raised bed transplanting for better bulb development.' },
            { name: 'Soybean', emoji: '🫘', match_score: 82, duration_days: 95, yield_per_acre: '8-10 quintals', estimated_income: '₹55,000', water_need: 'Low', reasons: 'Low water needs suit borewell irrigation. Government MSP guaranteed.', tip: 'Inoculate seeds with Rhizobium culture to reduce fertilizer cost.' },
            { name: 'Wheat', emoji: '🌾', match_score: 74, duration_days: 110, yield_per_acre: '15-18 quintals', estimated_income: '₹45,000', water_need: 'Medium', reasons: 'Good for Rabi season with moderate water availability. Stable MSP procurement.', tip: 'Use certified seed varieties like GW-322 for Nashik conditions.' }
        ],
        intercrop_suggestion: 'Try Onion + Garlic intercropping to increase income by 30%',
        caution: 'Monitor for purple blotch disease in humid conditions'
    });
};
