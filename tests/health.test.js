const request = require('supertest');
const app = require('../app');

describe('Health route', () => {
  it('returns API health status', async () => {
    const response = await request(app).get('/api/health');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.status).toBe('ok');
    expect(response.body.data.timestamp).toBeDefined();
  });
});
