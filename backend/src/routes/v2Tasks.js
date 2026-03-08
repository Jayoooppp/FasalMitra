/**
 * V2 Tasks Routes — uses provider-aware controllers
 */
const express = require('express');
const providerAuth = require('../middleware/providerAuth');
const { getAll, create, update, delete: deleteTask } = require('../controllers/providerTaskController');
const router = express.Router();

router.get('/', providerAuth, getAll);
router.post('/', providerAuth, create);
router.put('/:id', providerAuth, update);
router.delete('/:id', providerAuth, deleteTask);

module.exports = router;
