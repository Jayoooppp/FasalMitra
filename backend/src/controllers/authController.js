const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });
};

// POST /api/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, location, farmSize, soilType, preferredLanguage } = req.body;

        if (!location || farmSize == null || !soilType) {
            return res.status(400).json({ error: 'Location, farm size and soil type are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const user = await User.create({
            name,
            email,
            password,
            phone: phone || '',
            location,
            farmSize,
            soilType,
            preferredLanguage: preferredLanguage || 'English'
        });

        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                farmSize: user.farmSize,
                soilType: user.soilType,
                preferredLanguage: user.preferredLanguage
            }
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user._id);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                location: user.location,
                farmSize: user.farmSize,
                soilType: user.soilType,
                preferredLanguage: user.preferredLanguage
            }
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            farmSize: user.farmSize,
            soilType: user.soilType,
            preferredLanguage: user.preferredLanguage,
            activeCrops: user.activeCrops,
            createdAt: user.createdAt
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, location, farmSize, soilType, preferredLanguage } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { name, phone, location, farmSize, soilType, preferredLanguage },
            { new: true, runValidators: true }
        );
        res.json({
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            farmSize: user.farmSize,
            soilType: user.soilType,
            preferredLanguage: user.preferredLanguage
        });
    } catch (error) {
        next(error);
    }
};
