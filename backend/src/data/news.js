const news = [
    {
        id: 'pm-kisan-18',
        type: 'feature',
        category: 'Policy',
        categoryColor: '#7C3AED',
        emoji: '🌾',
        title: 'PM-KISAN 18th installment to be released on Feb 24',
        description: '₹6,000 annual benefit will be credited directly to farmer accounts. Ensure Aadhaar-bank linking before Feb 20.',
        time: '5 hours ago'
    },
    {
        id: 'cotton-surge',
        type: 'compact',
        category: 'Market',
        categoryColor: '#2563EB',
        emoji: '📈',
        title: 'Cotton prices surge 8% on strong export demand',
        subtitle: 'Highest in 6 months · 8 hours ago'
    },
    {
        id: 'drone-spray',
        type: 'compact',
        category: 'Tech',
        categoryColor: '#059669',
        emoji: '🚁',
        title: 'Drone pesticide spraying service launched in Nashik',
        subtitle: '50% subsidy · 1 day ago'
    },
    {
        id: 'imd-alert',
        type: 'compact',
        category: 'Weather',
        categoryColor: '#0891B2',
        emoji: '⚠️',
        title: 'IMD Alert: Unseasonal rain likely on Mar 2–3 in Nashik',
        subtitle: 'Protect harvested onions · 2 days ago'
    }
];

const weatherForecast = [
    { day: 'Today', emoji: '☀️', temp: '28°C' },
    { day: 'Tue', emoji: '⛅', temp: '27°C' },
    { day: 'Wed', emoji: '🌧️', temp: '25°C' },
    { day: 'Thu', emoji: '🌧️', temp: '24°C' },
    { day: 'Fri', emoji: '⛅', temp: '26°C' }
];

module.exports = { news, weatherForecast };
