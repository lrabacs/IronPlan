const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Workout = require('../models/Workout');

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// GET /api/workouts — fetch all workouts, newest first
router.get('/', async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ createdAt: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workouts' });
  }
});

// GET /api/workouts/:id — fetch a single workout
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid workout ID'
      });
    }

    const workout = await Workout.findById(req.params.id);

    if (!workout) {
      return res.status(404).json({
        message: 'Workout not found'
      });
    }

    res.json(workout);
  } catch (error) {
    res.status(500).json({
      message: 'Server error'
    });
  }
});

// POST /api/workouts — create a new workout
router.post('/', async (req, res) => {
  try {
    const workout = new Workout(req.body);
    const saved = await workout.save();
    res.status(201).json(saved);
  } catch (error) {
    // Mongoose validation errors get a 400, everything else 500
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to create workout' });
  }
});

// PUT /api/workouts/:id — update an existing workout
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid workout ID'
      });
    }

    const updated = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true } // return updated doc and run schema validation
    );
    if (!updated) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json(updated);
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Failed to update workout' });
  }
});

// DELETE /api/workouts/:id — delete a workout
router.delete('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({
        message: 'Invalid workout ID'
      });
    }

    const deleted = await Workout.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete workout' });
  }
});

module.exports = router;
