const { news, weatherForecast } = require('../data/news');

exports.getAll = (req, res) => {
    const { category } = req.query;
    let result = news;
    if (category && category !== 'All') {
        result = news.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }
    res.json({ news: result, weather: weatherForecast });
};
