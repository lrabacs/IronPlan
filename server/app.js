const express = require('express');
const cors = require('cors');
const workoutRoutes = require('./routes/workouts');

const app = express();

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({
  origin: corsOrigin
}));

app.use(express.json());

app.use('/api/workouts', workoutRoutes);

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'IronPlan API is running'
  });
});

app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

module.exports = app;