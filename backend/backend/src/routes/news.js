const express = require('express');
const { getAll } = require('../controllers/newsController');
const router = express.Router();

// GET /api/news
// Optional query params:
//   ?category=Weather|Policy|Market|Technology|Alerts|All
//   ?crops=Onion,Wheat,Soybean        (comma-separated active crops)
//   ?location=Nashik                   (user's city)
router.get('/', getAll);

module.exports = router;
