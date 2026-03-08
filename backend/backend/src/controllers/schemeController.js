const schemes = require('../data/schemes');

exports.getAll = (req, res) => {
    const { category } = req.query;
    let result = schemes;
    if (category && category !== 'All') {
        result = schemes.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    res.json({ schemes: result });
};

exports.getById = (req, res) => {
    const scheme = schemes.find(s => s.id === req.params.id);
    if (!scheme) return res.status(404).json({ error: 'Scheme not found' });
    res.json(scheme);
};
