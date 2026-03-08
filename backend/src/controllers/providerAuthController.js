/**
 * Provider-Aware Auth Controller
 * 
 * Uses the provider system to switch between local (JWT + MongoDB) 
 * and AWS (Cognito + DynamoDB) auth transparently.
 */

const providers = require('../providers');

// POST /api/v2/auth/register
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, location, farmSize, soilType, preferredLanguage } = req.body;

        if (!location || farmSize == null || !soilType) {
            return res.status(400).json({ error: 'Location, farm size and soil type are required' });
        }

        if (providers.name === 'aws') {
            // ── AWS Cognito + DynamoDB flow ──
            const cognitoResult = await providers.auth.signUp(email, password, {
                name, phone, location, farmSize, soilType,
            });

            // Auto-confirm for dev (remove in production and use email verification)
            try {
                await providers.auth.adminConfirmUser(email);
            } catch { /* May fail if auto-confirm is on */ }

            // Create user record in DynamoDB
            const user = await providers.db.createUser({
                userId: cognitoResult.userId,
                name, email, password, phone, location, farmSize, soilType,
                preferredLanguage: preferredLanguage || 'English',
            });

            // Log in to get Cognito tokens
            const tokens = await providers.auth.signIn(email, password);

            res.status(201).json({
                token: tokens.accessToken,
                user: {
                    id: user.userId || user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    farmSize: user.farmSize,
                    soilType: user.soilType,
                    preferredLanguage: user.preferredLanguage,
                    activeCrops: user.activeCrops || [],
                },
            });
        } else {
            // ── Local JWT + MongoDB flow (existing) ──
            const existingUser = await providers.db.findUserByEmail(email);
            if (existingUser) {
                return res.status(400).json({ error: 'Email already registered' });
            }

            const user = await providers.db.createUser({
                name, email, password, phone: phone || '',
                location, farmSize, soilType,
                preferredLanguage: preferredLanguage || 'English',
            });

            const token = providers.auth.generateToken(user._id);

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
                    activeCrops: user.activeCrops || [],
                },
            });
        }
    } catch (error) {
        if (error.name === 'UsernameExistsException' || error.name === 'ConditionalCheckFailedException') {
            return res.status(400).json({ error: 'Email already registered' });
        }
        next(error);
    }
};

// POST /api/v2/auth/login
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (providers.name === 'aws') {
            // ── AWS Cognito flow ──
            const tokens = await providers.auth.signIn(email, password);
            const decoded = await providers.auth.verifyToken(tokens.accessToken);
            const user = await providers.db.findUserById(decoded.id);

            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            res.json({
                token: tokens.accessToken,
                user: {
                    id: user.userId || user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    location: user.location,
                    farmSize: user.farmSize,
                    soilType: user.soilType,
                    preferredLanguage: user.preferredLanguage,
                    activeCrops: user.activeCrops || [],
                },
            });
        } else {
            // ── Local JWT flow (existing) ──
            const user = await providers.db.findUserByEmail(email);
            if (!user) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ error: 'Invalid email or password' });
            }

            const token = providers.auth.generateToken(user._id);

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
                    activeCrops: user.activeCrops || [],
                },
            });
        }
    } catch (error) {
        if (error.name === 'NotAuthorizedException' || error.name === 'UserNotFoundException') {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        next(error);
    }
};

// GET /api/v2/auth/profile
exports.getProfile = async (req, res, next) => {
    try {
        const user = req.user;
        res.json({
            id: user.userId || user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            farmSize: user.farmSize,
            soilType: user.soilType,
            preferredLanguage: user.preferredLanguage,
            activeCrops: user.activeCrops || [],
            createdAt: user.createdAt,
        });
    } catch (error) {
        next(error);
    }
};

// PUT /api/v2/auth/profile
exports.updateProfile = async (req, res, next) => {
    try {
        const { name, phone, location, farmSize, soilType, preferredLanguage } = req.body;
        const userId = req.userId;
        const user = await providers.db.updateUser(userId, {
            name, phone, location, farmSize, soilType, preferredLanguage,
        });
        res.json({
            id: user.userId || user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
            farmSize: user.farmSize,
            soilType: user.soilType,
            preferredLanguage: user.preferredLanguage,
        });
    } catch (error) {
        next(error);
    }
};

// GET /api/v2/auth/crops
exports.getActiveCrops = async (req, res, next) => {
    try {
        const user = await providers.db.findUserById(req.userId);
        res.json({ activeCrops: user.activeCrops || [] });
    } catch (error) {
        next(error);
    }
};

// POST /api/v2/auth/crops
exports.addActiveCrop = async (req, res, next) => {
    try {
        const { name, emoji, season, acreage, totalDays, startDate } = req.body;
        if (!name) return res.status(400).json({ error: 'Crop name is required' });

        const user = await providers.db.findUserById(req.userId);

        const alreadyExists = (user.activeCrops || []).some(
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
            totalDays: totalDays || 120,
        };

        const updatedUser = await providers.db.addActiveCrop(req.userId, newCrop);
        res.json({ activeCrops: updatedUser.activeCrops, added: newCrop });
    } catch (error) {
        next(error);
    }
};

// DELETE /api/v2/auth/crops/:cropId
exports.removeActiveCrop = async (req, res, next) => {
    try {
        const { cropId } = req.params;
        const updatedUser = await providers.db.removeActiveCrop(req.userId, cropId);
        res.json({ activeCrops: updatedUser.activeCrops });
    } catch (error) {
        next(error);
    }
};
