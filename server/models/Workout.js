const mongoose = require('mongoose');

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Abs',
  'Cardio',
  'Plyometrics',
  'Full Body'
];

const setSchema = new mongoose.Schema({
  reps: {
    type: Number,
    required: [true, 'Reps are required'],
    min: [1, 'Reps must be at least 1']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative'],
    default: null
  },
  weightUnit: {
    type: String,
    enum: ['lb', 'kg'],
    default: 'lb'
  }
});

const exerciseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Exercise name is required'],
    trim: true
  },
  sets: {
    type: [setSchema],
    validate: {
      validator: (sets) => sets.length > 0,
      message: 'Each exercise must have at least one set'
    }
  },
  restTime: {
    type: Number,
    min: [0, 'Rest time cannot be negative'],
    default: null
  },
  restUnit: {
    type: String,
    enum: ['seconds', 'minutes'],
    default: 'minutes'
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
});

const workoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    date: {
      type: String,
      required: [true, 'Workout date is required'],
      match: [
        /^\d{4}-\d{2}-\d{2}$/,
        'Workout date must use YYYY-MM-DD format'
      ]
    },
    startTime: {
      type: String,
      match: [
        /^([01]\d|2[0-3]):[0-5]\d$/,
        'Start time must use HH:MM format'
      ],
      default: null
    },
    durationMinutes: {
      type: Number,
      min: [1, 'Duration must be at least 1 minute'],
      default: null
    },
    difficulty: {
      type: Number,
      required: [true, 'Difficulty is required'],
      min: [1, 'Difficulty must be at least 1'],
      max: [10, 'Difficulty cannot be greater than 10']
    },
    muscleGroups: {
      type: [{
        type: String,
        enum: MUSCLE_GROUPS
      }],
      validate: {
        validator: (groups) => groups.length > 0,
        message: 'Select at least one muscle group'
      }
    },
    exercises: {
      type: [exerciseSchema],
      validate: {
        validator: (exercises) => exercises.length > 0,
        message: 'Add at least one exercise'
      }
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Workout', workoutSchema);