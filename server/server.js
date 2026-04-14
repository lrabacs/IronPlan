require('dotenv').config(); // Load .env variables before anything else

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const workoutRoutes = require('./routes/workouts');

const app = express();

// Connect to MongoDB Atlas
connectDB();

// --- Middleware ---

// CORS: allow requests from the React frontend
// In production, set CORS_ORIGIN to your actual Vercel domain
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// --- Routes ---
app.use('/api/workouts', workoutRoutes);

// Health check route — useful for Render's uptime checks
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'IronPlan API is running' });
});

// Catch-all 404 for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Start server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`IronPlan server running on port ${PORT}`);
});
