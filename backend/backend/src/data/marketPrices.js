const marketPrices = [
    {
        id: 'rice',
        name: 'Rice (Paddy)',
        emoji: '🌾',
        grade: 'Common Grade',
        price: 2200,
        unit: 'per quintal',
        msp: 2183,
        change: 3.2,
        direction: 'up',
        bestPrice: 2310,
        bestMarket: 'Pune APMC'
    },
    {
        id: 'cotton',
        name: 'Cotton',
        emoji: '🌿',
        grade: 'Medium Staple',
        price: 6850,
        unit: 'per quintal',
        msp: 6620,
        change: 5.8,
        direction: 'up',
        bestPrice: 7100,
        bestMarket: 'Nagpur'
    },
    {
        id: 'soybean',
        name: 'Soybean',
        emoji: '🫘',
        grade: 'Yellow',
        price: 4680,
        unit: 'per quintal',
        msp: 4600,
        change: 2.1,
        direction: 'up',
        bestPrice: 4850,
        bestMarket: 'Latur'
    },
    {
        id: 'onion',
        name: 'Onion',
        emoji: '🧅',
        grade: 'Red',
        price: 1850,
        unit: 'per quintal',
        msp: null,
        change: -4.2,
        direction: 'down',
        bestPrice: 2050,
        bestMarket: 'Lasalgaon'
    },
    {
        id: 'tomato',
        name: 'Tomato',
        emoji: '🍅',
        grade: 'Local',
        price: 2100,
        unit: 'per quintal',
        msp: null,
        change: 8.1,
        direction: 'up',
        bestPrice: 2800,
        bestMarket: 'Pune'
    }
];

const priceHistory = {
    onion: [
        { day: 'Mon', price: 1700 },
        { day: 'Tue', price: 1730 },
        { day: 'Wed', price: 1760 },
        { day: 'Thu', price: 1800 },
        { day: 'Fri', price: 1820 },
        { day: 'Sat', price: 1840 },
        { day: 'Today', price: 1850 }
    ]
};

const nearbyMarkets = [
    { name: 'Nashik APMC', distance: '12 km', todayVolume: '2,450 quintals' },
    { name: 'Sinnar Mandi', distance: '18 km', todayVolume: '880 quintals' },
    { name: 'Ozar Market', distance: '25 km', todayVolume: '1,200 quintals' }
];

module.exports = { marketPrices, priceHistory, nearbyMarkets };
