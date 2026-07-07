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
  scoreBreakdown: {
    skills: { maxScore: 40, rule: 'Awarded proportionally.', required: ['JavaScript', 'Node.js', 'SQL'] },
    domain: { maxScore: 25, rule: 'Awarded when domain matches.' },
    cgpa: { maxScore: 15, rule: 'Awarded when CGPA qualifies.' },
    location: { maxScore: 10, rule: 'Awarded when location matches.' },
    academicYear: { maxScore: 10, rule: 'Awarded when academic year qualifies.' },
    total: { maxScore: 100 },
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
