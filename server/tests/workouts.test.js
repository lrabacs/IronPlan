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

function makeWorkout(overrides = {}) {
    return {
        title: 'Leg Day',
        date: '2026-10-11',
        startTime: '17:30',
        durationMinutes: 75,
        difficulty: 8,
        muscleGroups: ['Legs'],
        exercises: [
            {
                name: 'Squat',
                sets: [
                    {
                        reps: 8,
                        weight: 225,
                        weightUnit: 'lb'
                    },
                    {
                        reps: 6,
                        weight: 245,
                        weightUnit: 'lb'
                    }
                ],
                restTime: 2,
                restUnit: 'minutes',
                notes: 'Depth felt good'
            }
        ],
        notes: 'Test workout',
        ...overrides
    };
}

describe('Workout API', () => {
    test('POST /api/workouts creates a workout', async () => {
        const workout = makeWorkout();

        const response = await request(app)
            .post('/api/workouts')
            .send(workout);

        expect(response.statusCode).toBe(201);
        expect(response.body.title).toBe('Leg Day');
        expect(response.body.date).toBe('2026-10-11');
        expect(response.body.difficulty).toBe(8);
        expect(response.body.muscleGroups).toEqual(['Legs']);
        expect(response.body.exercises).toHaveLength(1);
        expect(response.body.exercises[0].name).toBe('Squat');
        expect(response.body.exercises[0].sets).toHaveLength(2);
        expect(response.body.exercises[0].sets[0].weight).toBe(225);
        expect(response.body._id).toBeDefined();

        const count = await Workout.countDocuments();
        expect(count).toBe(1);
    });

    test('GET /api/workouts returns all workouts', async () => {
        await Workout.create(makeWorkout());

        await Workout.create(makeWorkout({
            title: 'Push Day',
            date: '2026-10-12',
            difficulty: 6,
            muscleGroups: ['Chest', 'Shoulders', 'Triceps'],
            exercises: [
                {
                    name: 'Bench Press',
                    sets: [
                        {
                            reps: 10,
                            weight: 135,
                            weightUnit: 'lb'
                        },
                        {
                            reps: 8,
                            weight: 155,
                            weightUnit: 'lb'
                        }
                    ],
                    restTime: 90,
                    restUnit: 'seconds',
                    notes: ''
                }
            ]
        }));

        const response = await request(app).get('/api/workouts');

        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveLength(2);
    });

    test('GET /api/workouts/:id returns one workout', async () => {
        const workout = await Workout.create(makeWorkout({
            title: 'Speed Day',
            date: '2026-10-13',
            difficulty: 9,
            muscleGroups: ['Legs', 'Plyometrics'],
            exercises: [
                {
                    name: 'Box Jumps',
                    sets: [
                        {
                            reps: 5,
                            weightUnit: 'lb'
                        },
                        {
                            reps: 5,
                            weightUnit: 'lb'
                        }
                    ],
                    restTime: 2,
                    restUnit: 'minutes',
                    notes: 'Focus on maximum height'
                }
            ]
        }));

        const response = await request(app)
            .get(`/api/workouts/${workout._id}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Speed Day');
        expect(response.body.muscleGroups).toContain('Plyometrics');
        expect(response.body._id).toBe(workout._id.toString());
    });

    test('PUT /api/workouts/:id updates a workout', async () => {
        const workout = await Workout.create(makeWorkout({
            title: 'Old Workout'
        }));

        const response = await request(app)
            .put(`/api/workouts/${workout._id}`)
            .send(makeWorkout({
                title: 'Updated Workout',
                difficulty: 9,
                muscleGroups: ['Back', 'Biceps'],
                exercises: [
                    {
                        name: 'Barbell Row',
                        sets: [
                            {
                                reps: 8,
                                weight: 155,
                                weightUnit: 'lb'
                            },
                            {
                                reps: 7,
                                weight: 165,
                                weightUnit: 'lb'
                            }
                        ],
                        restTime: 2,
                        restUnit: 'minutes',
                        notes: ''
                    }
                ]
            }));

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe('Updated Workout');
        expect(response.body.difficulty).toBe(9);
        expect(response.body.exercises[0].name).toBe('Barbell Row');
        expect(response.body.exercises[0].sets[1].weight).toBe(165);

        const updatedWorkout = await Workout.findById(workout._id);
        expect(updatedWorkout.title).toBe('Updated Workout');
    });

    test('DELETE /api/workouts/:id deletes a workout', async () => {
        const workout = await Workout.create(makeWorkout({
            title: 'Delete Me'
        }));

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
            .send(makeWorkout());

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
        const workout = makeWorkout();
        delete workout.title;

        const response = await request(app)
            .post('/api/workouts')
            .send(workout);

        expect(response.statusCode).toBe(400);
    });

    test('POST /api/workouts returns 400 for an invalid difficulty', async () => {
        const response = await request(app)
            .post('/api/workouts')
            .send(makeWorkout({
                difficulty: 11
            }));

        expect(response.statusCode).toBe(400);
    });

    test('PUT /api/workouts/:id returns 400 for invalid workout data', async () => {
        const workout = await Workout.create(makeWorkout({
            title: 'Valid Workout'
        }));

        const response = await request(app)
            .put(`/api/workouts/${workout._id}`)
            .send({
                exercises: [
                    {
                        name: 'Bench Press',
                        sets: [
                            {
                                reps: 0,
                                weight: 185,
                                weightUnit: 'lb'
                            }
                        ]
                    }
                ]
            });

        expect(response.statusCode).toBe(400);
    });

    test('GET /api/workouts returns workouts newest date first', async () => {
        await Workout.create(makeWorkout({
            title: 'Older Workout',
            date: '2026-10-01'
        }));

        await Workout.create(makeWorkout({
            title: 'Newer Workout',
            date: '2026-10-15'
        }));

        const response = await request(app).get('/api/workouts');

        expect(response.statusCode).toBe(200);
        expect(response.body[0].title).toBe('Newer Workout');
        expect(response.body[1].title).toBe('Older Workout');
    });

    test('POST /api/workouts returns 400 for an invalid calendar date', async () => {
        const response = await request(app)
            .post('/api/workouts')
            .send(makeWorkout({
                date: '2026-02-31'
            }));

        expect(response.statusCode).toBe(400);
    });

    test('POST /api/workouts returns 400 with no muscle groups', async () => {
        const response = await request(app)
            .post('/api/workouts')
            .send(makeWorkout({
                muscleGroups: []
            }));

        expect(response.statusCode).toBe(400);
    });

    test('POST /api/workouts allows a bodyweight set with no weight', async () => {
        const response = await request(app)
            .post('/api/workouts')
            .send(makeWorkout({
                title: 'Bodyweight Workout',
                exercises: [
                    {
                        name: 'Push-Ups',
                        sets: [
                            {
                                reps: 20,
                                weight: null,
                                weightUnit: 'lb'
                            }
                        ],
                        restTime: 60,
                        restUnit: 'seconds',
                        notes: ''
                    }
                ]
            }));

        expect(response.statusCode).toBe(201);
        expect(response.body.exercises[0].sets[0].weight).toBeNull();
        expect(response.body.exercises[0].sets[0].reps).toBe(20);
    });
});