/**
 * Local DB Provider — wrapper around existing Mongoose models.
 * Exposes a uniform interface that matches the AWS DynamoDB provider.
 */

const User = require('../../models/User');
const Task = require('../../models/Task');
const Listing = require('../../models/Listing');

module.exports = {
    // ───── User Operations ─────
    async createUser(data) {
        const user = await User.create(data);
        return user;
    },

    async findUserByEmail(email) {
        return User.findOne({ email }).select('+password');
    },

    async findUserById(id) {
        return User.findById(id);
    },

    async updateUser(id, data) {
        return User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    },

    async addActiveCrop(userId, crop) {
        const user = await User.findById(userId);
        user.activeCrops.push(crop);
        await user.save();
        return user;
    },

    async removeActiveCrop(userId, cropId) {
        const user = await User.findById(userId);
        user.activeCrops = user.activeCrops.filter(c => c._id.toString() !== cropId);
        await user.save();
        return user;
    },

    // ───── Task Operations ─────
    async getTasks(userId) {
        return Task.find({ userId }).sort({ createdAt: -1 });
    },

    async createTask(data) {
        return Task.create(data);
    },

    async updateTask(id, userId, data) {
        return Task.findOneAndUpdate({ _id: id, userId }, data, { new: true });
    },

    async deleteTask(id, userId) {
        return Task.findOneAndDelete({ _id: id, userId });
    },

    // ───── Listing Operations ─────
    async getListings(filters = {}) {
        return Listing.find(filters).sort({ createdAt: -1 });
    },

    async createListing(data) {
        return Listing.create(data);
    },

    // ───── Connection ─────
    async connect() {
        const connectDB = require('../../config/db');
        return connectDB();
    },
};
