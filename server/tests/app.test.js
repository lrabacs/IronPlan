const request = require('supertest');
const app = require('../app');

describe('App routes', () => {
  test('GET /health returns API status', async () => {
    const response = await request(app).get('/health');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      status: 'ok',
      message: 'IronPlan API is running'
    });
  });

  test('unknown route returns 404', async () => {
    const response = await request(app).get('/not-a-real-route');

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: 'Route not found'
    });
  });
});