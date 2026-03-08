const express = require('express');
const auth = require('../middleware/auth');
const { getAll, create, update, remove } = require('../controllers/taskController');
const router = express.Router();

router.get('/', auth, getAll);
router.post('/', auth, create);
router.put('/:id', auth, update);
router.delete('/:id', auth, remove);

module.exports = router;
