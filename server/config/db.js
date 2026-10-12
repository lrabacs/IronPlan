const mongoose = require('mongoose');

// Connect to MongoDB Atlas using the MONGO_URI from .env
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);

    // Stop startup if the database connection fails.
    process.exit(1);
  }
};

module.exports = connectDB;
