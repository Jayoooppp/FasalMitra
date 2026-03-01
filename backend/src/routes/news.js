const express = require('express');
const { getAll } = require('../controllers/newsController');
const router = express.Router();

router.get('/', getAll);

module.exports = router;
