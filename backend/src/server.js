require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');
const schemeRoutes = require('./routes/schemes');
const diseaseRoutes = require('./routes/disease');
const cropRoutes = require('./routes/crop');
const laborRoutes = require('./routes/labor');
const soilRoutes = require('./routes/soil');
const newsRoutes = require('./routes/news');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'FasalMitra API', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/labor', laborRoutes);
app.use('/api/soil', soilRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`\n🌾 FasalMitra API Server running on port ${PORT}`);
            console.log(`📡 Health check: http://localhost:${PORT}/api/health\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
