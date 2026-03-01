const express = require('express');
const { getData } = require('../controllers/soilController');
const router = express.Router();

router.get('/', getData);

module.exports = router;
