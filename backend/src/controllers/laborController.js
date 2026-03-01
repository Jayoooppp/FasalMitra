const laborers = require('../data/laborers');

exports.getAll = (req, res) => {
    const { skill } = req.query;
    let result = laborers;
    if (skill && skill !== 'All') {
        result = laborers.filter(l => l.skills.some(s => s.toLowerCase() === skill.toLowerCase()));
    }
    res.json({ laborers: result });
};

exports.getById = (req, res) => {
    const laborer = laborers.find(l => l.id === req.params.id);
    if (!laborer) return res.status(404).json({ error: 'Worker not found' });
    res.json(laborer);
};
