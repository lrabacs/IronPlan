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

    test('GET /api/workouts/:id returns 400 for an invalid ID', async () => {
        const response = await request(app)
            .get('/api/workouts/not-a-real-id');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid workout ID'
        });
    });

    test('PUT /api/workouts/:id returns 400 for an invalid ID', async () => {
        const response = await request(app)
            .put('/api/workouts/not-a-real-id')
            .send({});

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid workout ID'
        });
    });

    test('DELETE /api/workouts/:id returns 400 for an invalid ID', async () => {
        const response = await request(app)
            .delete('/api/workouts/not-a-real-id');

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({
            message: 'Invalid workout ID'
        });
    });

    test('GET /api/workouts/:id returns 404 for a missing workout', async () => {
        const missingId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .get(`/api/workouts/${missingId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: 'Workout not found'
        });
    });

    test('PUT /api/workouts/:id returns 404 for a missing workout', async () => {
        const missingId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .put(`/api/workouts/${missingId}`)
            .send({
                title: 'Missing Workout',
                day: 'Saturday',
                muscleGroup: 'Legs',
                exercises: 'Squat',
                sets: 3,
                reps: 8,
                difficulty: 'Intermediate'
            });

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: 'Workout not found'
        });
    });

    test('DELETE /api/workouts/:id returns 404 for a missing workout', async () => {
        const missingId = new mongoose.Types.ObjectId();

        const response = await request(app)
            .delete(`/api/workouts/${missingId}`);

        expect(response.statusCode).toBe(404);
        expect(response.body).toEqual({
            message: 'Workout not found'
        });
    });

    test('POST /api/workouts returns 400 when required data is missing', async () => {
        const response = await request(app)
            .post('/api/workouts')
            .send({
                day: 'Monday',
                muscleGroup: 'Legs',
                exercises: 'Squat',
                sets: 3,
                reps: 8,
                difficulty: 'Intermediate'
            });

        expect(response.statusCode).toBe(400);
    });

    test('POST /api/workouts returns 400 for an invalid difficulty', async () => {
        const response = await request(app)
            .post('/api/workouts')
            .send({
                title: 'Bad Workout',
                day: 'Monday',
                muscleGroup: 'Legs',
                exercises: 'Squat',
                sets: 3,
                reps: 8,
                difficulty: 'Impossible'
            });

        expect(response.statusCode).toBe(400);
    });

    test('PUT /api/workouts/:id returns 400 for invalid workout data', async () => {
        const workout = await Workout.create({
            title: 'Valid Workout',
            day: 'Tuesday',
            muscleGroup: 'Chest',
            exercises: 'Bench Press',
            sets: 3,
            reps: 10,
            difficulty: 'Beginner'
        });

        const response = await request(app)
            .put(`/api/workouts/${workout._id}`)
            .send({
                sets: 0
            });

        expect(response.statusCode).toBe(400);
    });
});