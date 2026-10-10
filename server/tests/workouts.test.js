const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Workout = require('../models/Workout');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
}, 60000);

afterEach(async () => {
  await Workout.deleteMany({});
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Workout API', () => {
  test('POST /api/workouts creates a workout', async () => {
    const workout = {
      title: 'Leg Day',
      day: 'Monday',
      muscleGroup: 'Legs',
      exercises: 'Squat, RDL',
      sets: 4,
      reps: 8,
      notes: 'Test workout',
      difficulty: 'Intermediate'
    };

    const response = await request(app)
      .post('/api/workouts')
      .send(workout);

    expect(response.statusCode).toBe(201);
    expect(response.body.title).toBe('Leg Day');
    expect(response.body._id).toBeDefined();

    const count = await Workout.countDocuments();
    expect(count).toBe(1);
  });
});