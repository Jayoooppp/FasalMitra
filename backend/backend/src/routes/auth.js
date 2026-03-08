const express = require('express');
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const auth = require('../middleware/auth');
const {
    register,
    login,
    getProfile,
    updateProfile,
    getActiveCrops,
    addActiveCrop,
    removeActiveCrop
} = require('../controllers/authController');

const router = express.Router();

router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], validate, register);

router.post('/login', [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
], validate, login);

router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);

// Active crop management
router.get('/crops', auth, getActiveCrops);
router.post('/crops', auth, addActiveCrop);
router.delete('/crops/:cropId', auth, removeActiveCrop);

module.exports = router;
