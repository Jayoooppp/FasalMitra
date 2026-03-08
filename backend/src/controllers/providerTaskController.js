/**
 * Provider-Aware Task Controller
 * 
 * Uses the provider system for task CRUD— MongoDB or DynamoDB.
 */

const providers = require('../providers');

exports.getAll = async (req, res, next) => {
    try {
        const tasks = await providers.db.getTasks(req.userId);
        res.json({ tasks });
    } catch (error) {
        next(error);
    }
};

exports.create = async (req, res, next) => {
    try {
        const { title, description, priority, dueDate } = req.body;
        if (!title) return res.status(400).json({ error: 'Title is required' });

        const task = await providers.db.createTask({
            userId: req.userId,
            title,
            description,
            priority,
            dueDate,
        });
        res.status(201).json(task);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const task = await providers.db.updateTask(req.params.id, req.userId, req.body);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        await providers.db.deleteTask(req.params.id, req.userId);
        res.json({ message: 'Task deleted' });
    } catch (error) {
        next(error);
    }
};
