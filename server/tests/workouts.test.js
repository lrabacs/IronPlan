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

    test('GET /api/workouts returns all workouts', async () => {
        await Workout.create({
            title: 'Leg Day',
            day: 'Monday',
            muscleGroup: 'Legs',
            exercises: 'Squat, RDL',
            sets: 4,
            reps: 8,
            difficulty: 'Intermediate'
        });

        await Workout.create({
            title: 'Upper Body',
            day: 'Tuesday',
            muscleGroup: 'Chest',
            exercises: 'Bench Press, Push Ups',
            sets: 3,
            reps: 10,
            difficulty: 'Beginner'
        });

        const response = await request(app).get('/api/workouts');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    test('GET /api/workouts/:id returns one workout', async () => {
        const workout = await Workout.create({
            title: 'Speed Day',
            day: 'Wednesday',
            muscleGroup: 'Legs',
            exercises: 'Sprints, Lunges',
            sets: 5,
            reps: 6,
            difficulty: 'Advanced'
        });

        const response = await request(app)
            .get(`/api/workouts/${workout._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Speed Day');
        expect(response.body._id).toBe(workout._id.toString());
    });

    test('PUT /api/workouts/:id updates a workout', async () => {
        const workout = await Workout.create({
            title: 'Old Workout',
            day: 'Thursday',
            muscleGroup: 'Back',
            exercises: 'Rows',
            sets: 3,
            reps: 10,
            difficulty: 'Beginner'
        });

        const response = await request(app)
            .put(`/api/workouts/${workout._id}`)
            .send({
                title: 'Updated Workout',
                day: 'Thursday',
                muscleGroup: 'Back',
                exercises: 'Rows, Pull Ups',
                sets: 4,
                reps: 8,
                difficulty: 'Intermediate'
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Updated Workout');
        expect(response.body.sets).toBe(4);

        const updatedWorkout = await Workout.findById(workout._id);
        expect(updatedWorkout.title).toBe('Updated Workout');
    });

    test('DELETE /api/workouts/:id deletes a workout', async () => {
        const workout = await Workout.create({
            title: 'Delete Me',
            day: 'Friday',
            muscleGroup: 'Arms',
            exercises: 'Curls',
            sets: 3,
            reps: 12,
            difficulty: 'Beginner'
        });

        const response = await request(app)
            .delete(`/api/workouts/${workout._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Workout deleted successfully'
        });

        const deletedWorkout = await Workout.findById(workout._id);
        expect(deletedWorkout).toBeNull();
    });
});