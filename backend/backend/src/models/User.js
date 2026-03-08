const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: 6,
        select: false
    },
    phone: {
        type: String,
        trim: true,
        default: ''
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true
    },
    farmSize: {
        type: Number,
        required: [true, 'Farm size is required']
    },
    soilType: {
        type: String,
        required: [true, 'Soil type is required']
    },
    preferredLanguage: {
        type: String,
        enum: ['English', 'Hindi', 'Marathi'],
        default: 'English'
    },
    activeCrops: [{
        name: String,
        emoji: { type: String, default: '🌱' },
        season: String,
        startDate: Date,
        acreage: Number,
        dayCount: Number,
        totalDays: Number
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
