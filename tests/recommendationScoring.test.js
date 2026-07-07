const { rankInternships } = require('../utils/recommendationScoring');

const profile = {
  skills: ['JavaScript', 'Node.js', 'SQL'],
  cgpa: 7.5,
  preferredDomain: 'Backend Development',
  preferredLocation: 'Chennai',
  academicYear: 3,
};

const internships = [
  {
    id: 1,
    title: 'Backend Engineering Intern',
    company: 'Zoho',
    location: 'Chennai',
    domain: 'Backend Development',
    requiredSkills: ['JavaScript', 'Node.js', 'SQL', 'REST APIs'],
    minimumCGPA: 7,
    academicYear: 3,
    stipend: 25000,
    internshipType: 'Onsite',
    description: 'Build APIs.',
  },
  {
    id: 2,
    title: 'Frontend Developer Intern',
    company: 'Razorpay',
    location: 'Bengaluru',
    domain: 'Frontend Development',
    requiredSkills: ['JavaScript', 'React', 'HTML', 'CSS'],
    minimumCGPA: 7,
    academicYear: 2,
    stipend: 35000,
    internshipType: 'Hybrid',
    description: 'Build UI.',
  },
  {
    id: 3,
    title: 'Data Analyst Intern',
    company: 'Swiggy',
    location: 'Bengaluru',
    domain: 'Data Analytics',
    requiredSkills: ['Python', 'Excel'],
    minimumCGPA: 8,
    academicYear: 4,
    stipend: 30000,
    internshipType: 'Hybrid',
    description: 'Analyze data.',
  },
  {
    id: 4,
    title: 'Full Stack Developer Intern',
    company: 'Postman',
    location: 'Remote',
    domain: 'Full Stack Development',
    requiredSkills: ['JavaScript', 'Node.js', 'MongoDB'],
    minimumCGPA: 7,
    academicYear: 3,
    stipend: 50000,
    internshipType: 'Remote',
    description: 'Build full stack features.',
  },
];

describe('recommendation scoring', () => {
  it('ranks internships deterministically using weighted scores', () => {
    const recommendations = rankInternships(profile, internships);

    expect(recommendations).toHaveLength(3);
    expect(recommendations[0].internship.id).toBe(1);
    expect(recommendations[0].score).toBe(90);
    expect(recommendations[0].matchedFields.domain).toBe(true);
    expect(recommendations[0].matchedFields.skills.matched).toEqual(['javascript', 'node.js', 'sql']);
    expect(recommendations[0].explanation).toContain('It matches 3 of 4 required skills');
  });

  it('returns an empty list when no internship scores above zero', () => {
    const recommendations = rankInternships(
      {
        skills: ['Rust'],
        cgpa: 0,
        preferredDomain: 'Blockchain',
        preferredLocation: 'Kochi',
        academicYear: 1,
      },
      internships
    );

    expect(recommendations).toEqual([]);
  });
});
