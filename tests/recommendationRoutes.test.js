jest.mock('../services/recommendationService', () => ({
  getTopMatches: jest.fn(),
}));

const request = require('supertest');
const app = require('../app');
const recommendationService = require('../services/recommendationService');

const profile = {
  skills: ['JavaScript', 'Node.js'],
  cgpa: 8,
  preferredDomain: 'Backend Development',
  preferredLocation: 'Chennai',
  academicYear: 3,
};

describe('Recommendation route', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /recommend returns top recommendations', async () => {
    recommendationService.getTopMatches.mockResolvedValue([
      {
        internship: { id: 1, title: 'Backend Engineering Intern' },
        score: 90,
        matchedFields: { domain: true },
        explanation: 'Strong backend match.',
      },
    ]);

    const response = await request(app).post('/recommend').send(profile);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.recommendations).toHaveLength(1);
    expect(response.body.data.recommendations[0].score).toBe(90);
    expect(response.body.data.recommendations[0].explanation).toBe('Strong backend match.');
    expect(recommendationService.getTopMatches).toHaveBeenCalledWith(profile);
  });

  it('POST /recommend returns 400 when a required field is missing', async () => {
    const response = await request(app).post('/recommend').send({
      skills: ['JavaScript'],
      cgpa: 8,
      preferredDomain: 'Backend Development',
      preferredLocation: 'Chennai',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.error.message).toContain('Missing required field');
    expect(recommendationService.getTopMatches).not.toHaveBeenCalled();
  });

  it('POST /recommend returns 400 when skills is not an array', async () => {
    const response = await request(app).post('/recommend').send({
      ...profile,
      skills: 'JavaScript',
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.error.message).toBe('skills must be an array');
  });

  it('POST /recommend returns an empty list when no internships match', async () => {
    recommendationService.getTopMatches.mockResolvedValue([]);

    const response = await request(app).post('/recommend').send({
      skills: ['Rust'],
      cgpa: 4,
      preferredDomain: 'Blockchain',
      preferredLocation: 'Kochi',
      academicYear: 1,
    });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.recommendations).toEqual([]);
  });
});
