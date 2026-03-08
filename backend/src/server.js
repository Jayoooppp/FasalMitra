require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// ── Original route imports (unchanged) ──
const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');
const schemeRoutes = require('./routes/schemes');
const diseaseRoutes = require('./routes/disease');
const cropRoutes = require('./routes/crop');
const laborRoutes = require('./routes/labor');
const newsRoutes = require('./routes/news');
const taskRoutes = require('./routes/tasks');
const aiRoutes = require('./routes/ai');
const weatherRoutes = require('./routes/weather');

// ── V2 Provider-aware route imports ──
const v2AuthRoutes = require('./routes/v2Auth');
const v2AiRoutes = require('./routes/v2Ai');
const v2TaskRoutes = require('./routes/v2Tasks');
const storageRoutes = require('./routes/storage');
const ttsRoutes = require('./routes/tts');

// ── Provider system ──
const providers = require('./providers');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'FasalMitra API',
        provider: providers.name,
        timestamp: new Date().toISOString(),
    });
});

// ── Original Routes (v1 — unchanged, always available) ──
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/schemes', schemeRoutes);
app.use('/api/diseases', diseaseRoutes);
app.use('/api/crop', cropRoutes);
app.use('/api/labor', laborRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/weather', weatherRoutes);

// ── V2 Provider-Aware Routes ──
// These use the provider system (local or AWS) transparently
app.use('/api/v2/auth', v2AuthRoutes);
app.use('/api/v2/ai', v2AiRoutes);
app.use('/api/v2/tasks', v2TaskRoutes);
app.use('/api/v2/storage', storageRoutes);
app.use('/api/v2/tts', ttsRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect using the provider system
        if (providers.name === 'aws') {
            await providers.db.connect(); // Creates DynamoDB tables if needed
        } else {
            await connectDB(); // Existing MongoDB connection
        }

        app.listen(PORT, () => {
            console.log(`\n🌾 FasalMitra API Server running on port ${PORT}`);
            console.log(`🔧 Provider: ${providers.name.toUpperCase()}`);
            console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
            console.log(`📡 V2 routes:    /api/v2/auth, /api/v2/ai, /api/v2/tasks, /api/v2/storage, /api/v2/tts\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
