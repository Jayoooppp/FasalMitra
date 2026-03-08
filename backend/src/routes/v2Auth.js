/**
 * V2 Auth Routes — uses provider-aware controllers
 */
const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const providerAuth = require('../middleware/providerAuth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    getActiveCrops,
    addActiveCrop,
    removeActiveCrop,
} = require('../controllers/providerAuthController');

const router = express.Router();

router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
], validate, register);

router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
], validate, login);

router.get('/profile', providerAuth, getProfile);
router.put('/profile', providerAuth, updateProfile);

router.get('/crops', providerAuth, getActiveCrops);
router.post('/crops', providerAuth, addActiveCrop);
router.delete('/crops/:cropId', providerAuth, removeActiveCrop);

module.exports = router;
