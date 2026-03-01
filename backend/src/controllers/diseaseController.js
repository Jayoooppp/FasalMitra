const diseases = require('../data/diseases');

exports.getAll = (req, res) => {
    res.json({ diseases });
};

exports.getById = (req, res) => {
    const disease = diseases.find(d => d.id === req.params.id);
    if (!disease) return res.status(404).json({ error: 'Disease not found' });
    res.json(disease);
};

exports.getHistory = (req, res) => {
    // Returns mock diagnosis history
    res.json({
        history: [
            { disease: 'Purple Blotch', crop: 'Onion', severity: 'High Risk', date: 'Jan 28', confidence: 94, treatment: 'Mancozeb spray. Follow-up needed.' },
            { disease: 'Thrips Infestation', crop: 'Onion', severity: 'Medium', date: 'Jan 15', confidence: 88, treatment: 'Blue sticky traps installed. Spinosad spray applied.' },
            { disease: 'Healthy Plant', crop: 'Onion', severity: 'Healthy', date: 'Dec 20', confidence: 100, treatment: null }
        ]
    });
};
