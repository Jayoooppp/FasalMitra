const express = require('express');
const { getAll, getById, getHistory } = require('../controllers/diseaseController');
const router = express.Router();

router.get('/', getAll);
router.get('/history', getHistory);
router.get('/:id', getById);

module.exports = router;
