const Task = require('../models/Task');

exports.getAll = async (req, res, next) => {
    try {
        const tasks = await Task.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ tasks });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const task = await Task.create({ ...req.body, userId: req.userId });
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const task = await Task.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        next(error);
    }
};

exports.remove = async (req, res, next) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};
