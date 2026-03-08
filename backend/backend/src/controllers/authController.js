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
                preferredLanguage: user.preferredLanguage,
                activeCrops: user.activeCrops || []
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
                preferredLanguage: user.preferredLanguage,
                activeCrops: user.activeCrops || []
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
            activeCrops: user.activeCrops || [],
            createdAt: user.createdAt
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/auth/crops — get the current user's active crops
exports.getActiveCrops = async (req, res, next) => {
    try {
        const user = await require('../models/User').findById(req.userId);
        res.json({ activeCrops: user.activeCrops || [] });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/crops — add a crop to the user's active crops
exports.addActiveCrop = async (req, res, next) => {
    try {
        const { name, emoji, season, acreage, totalDays, startDate } = req.body;
        if (!name) return res.status(400).json({ error: 'Crop name is required' });

        const User = require('../models/User');
        const user = await User.findById(req.userId);

        // Prevent duplicates
        const alreadyExists = user.activeCrops.some(
            c => c.name.toLowerCase() === name.toLowerCase()
        );
        if (alreadyExists) {
            return res.status(400).json({ error: `${name} is already in your active crops` });
        }

        const start = startDate ? new Date(startDate) : new Date();
        const now = new Date();
        const diffMs = now - start;
        const dayCount = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

        const newCrop = {
            name,
            emoji: emoji || '🌱',
            season: season || 'Kharif',
            startDate: start,
            acreage: acreage || 1,
            dayCount,
            totalDays: totalDays || 120
        };

        user.activeCrops.push(newCrop);
        await user.save();

        res.json({ activeCrops: user.activeCrops, added: newCrop });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/auth/crops/:cropId — remove a crop from the user's active crops
exports.removeActiveCrop = async (req, res, next) => {
    try {
        const { cropId } = req.params;
        const User = require('../models/User');
        const user = await User.findById(req.userId);

        user.activeCrops = user.activeCrops.filter(
            c => c._id.toString() !== cropId
        );
        await user.save();

        res.json({ activeCrops: user.activeCrops });
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
