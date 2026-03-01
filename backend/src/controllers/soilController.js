const soilData = require('../data/soilData');

exports.getData = (req, res) => {
    res.json(soilData);
};
