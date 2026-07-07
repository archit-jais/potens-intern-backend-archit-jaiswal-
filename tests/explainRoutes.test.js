jest.mock('../services/explainService', () => ({
  explainItem: jest.fn(),
}));

const request = require('supertest');
const app = require('../app');
const explainService = require('../services/explainService');

const explanationPayload = {
  internship: {
    id: 1,
    title: 'Backend Engineering Intern',
    company: 'Zoho',
    location: 'Chennai',
    domain: 'Backend Development',
  },
  eligibilityCriteria: {
    requiredSkills: ['JavaScript', 'Node.js', 'SQL'],
    minimumCGPA: 7,
    academicYear: 3,
    preferredDomain: 'Backend Development',
    preferredLocation: 'Chennai',
    internshipType: 'Onsite',
  },
  explanation: 'This internship is best suited for backend students.',
};

describe('Explain route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('GET /explain/:id returns internship details and eligibility explanation', async () => {
    explainService.explainItem.mockResolvedValue(explanationPayload);

    const response = await request(app).get('/explain/1');

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(explanationPayload);
    expect(explainService.explainItem).toHaveBeenCalledWith('1');
  });

  it('GET /explain/:id returns 404 when item does not exist', async () => {
    explainService.explainItem.mockResolvedValue(null);

    const response = await request(app).get('/explain/999');

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toBe('Item not found');
  });
});
