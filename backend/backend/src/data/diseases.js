const diseases = [
    {
        id: 'purple-blotch',
        name: 'Purple Blotch',
        icon: '🦠',
        iconBg: '#FCE4EC',
        crops: 'Onion, Garlic',
        type: 'Fungal',
        riskLevel: 'High',
        description: 'Caused by Alternaria porri. Small white to straw-coloured lesions with purple centre on leaves. Can cause 30–50% yield loss in severe cases.',
        treatments: [
            { step: 1, action: 'Spray Mancozeb 75WP @ 2g/litre or Propiconazole 25EC @ 1ml/litre' },
            { step: 2, action: 'Repeat spray after 10 days if infection persists' },
            { step: 3, action: 'Remove and destroy heavily infected plant parts' },
            { step: 4, action: 'Avoid overhead irrigation; spray in evening hours only' }
        ]
    },
    {
        id: 'blast-disease',
        name: 'Blast Disease',
        icon: '🔴',
        iconBg: '#FCE4EC',
        crops: 'Rice',
        type: 'Fungal',
        riskLevel: 'Medium'
    },
    {
        id: 'powdery-mildew',
        name: 'Powdery Mildew',
        icon: '⚪',
        iconBg: '#E3F2FD',
        crops: 'Many crops',
        type: 'Fungal',
        riskLevel: 'Medium'
    },
    {
        id: 'aphid-infestation',
        name: 'Aphid Infestation',
        icon: '🐛',
        iconBg: '#FFF8E1',
        crops: 'Onion, Wheat',
        type: 'Pest',
        riskLevel: 'High',
        description: 'Small soft-bodied insects clustering on undersides of leaves. Cause curling, yellowing and transmission of viruses.',
        treatments: [
            { step: 1, action: 'Install yellow sticky traps as monitoring tool (1 per 100 sq m)' },
            { step: 2, action: 'Spray Imidacloprid 17.8 SL @ 0.5 ml/litre or Thiamethoxam 25 WG' },
            { step: 3, action: 'Neem oil 2% spray as organic alternative every 7 days' }
        ]
    },
    {
        id: 'yellow-leaf-curl',
        name: 'Yellow Leaf Curl Virus',
        icon: '💛',
        iconBg: '#FFFDE7',
        crops: 'Tomato',
        type: 'Viral',
        riskLevel: 'Medium'
    },
    {
        id: 'stem-borer',
        name: 'Stem Borer',
        icon: '🐝',
        iconBg: '#E8F5E9',
        crops: 'Rice, Sugarcane',
        type: 'Pest',
        riskLevel: 'Medium'
    }
];

module.exports = diseases;
