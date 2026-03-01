const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    crop: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    expectedPrice: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'expired'],
        default: 'active'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Listing', listingSchema);
