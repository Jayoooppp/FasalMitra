/**
 * Local Auth Provider — wrapper around existing JWT + bcrypt auth.
 * Exposes a uniform interface that matches the AWS Cognito provider.
 */

const jwt = require('jsonwebtoken');

module.exports = {
    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || '7d',
        });
    },

    verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    },

    /**
     * Authenticate middleware — verifies JWT, attaches user to req
     */
    async authenticate(req, res, next) {
        try {
            const token = req.header('Authorization')?.replace('Bearer ', '');
            if (!token) {
                return res.status(401).json({ error: 'Access denied. No token provided.' });
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const User = require('../../models/User');
            const user = await User.findById(decoded.id);
            if (!user) {
                return res.status(401).json({ error: 'Invalid token. User not found.' });
            }
            req.user = user;
            req.userId = user._id;
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid or expired token.' });
        }
    },
};
