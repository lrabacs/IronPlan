const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    day: {
      type: String,
      required: [true, 'Day is required'],
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    muscleGroup: {
      type: String,
      required: [true, 'Muscle group is required'],
      trim: true,
    },
    exercises: {
      type: String,
      required: [true, 'Exercises are required'],
      trim: true,
    },
    sets: {
      type: Number,
      required: [true, 'Sets is required'],
      min: [1, 'Sets must be at least 1'],
    },
    reps: {
      type: Number,
      required: [true, 'Reps is required'],
      min: [1, 'Reps must be at least 1'],
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
    difficulty: {
      type: String,
      required: [true, 'Difficulty is required'],
      enum: ['Beginner', 'Intermediate', 'Advanced'],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

module.exports = mongoose.model('Workout', workoutSchema);
