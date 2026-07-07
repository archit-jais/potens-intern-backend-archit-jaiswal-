const {
  buildEligibilityCriteria,
  buildEligibilityExplanation,
} = require('../utils/eligibilityExplanation');

const internship = {
  id: 1,
  title: 'Backend Engineering Intern',
  company: 'Zoho',
  location: 'Chennai',
  domain: 'Backend Development',
  requiredSkills: ['JavaScript', 'Node.js', 'SQL'],
  minimumCGPA: '7.00',
  academicYear: 3,
  stipend: 25000,
  internshipType: 'Onsite',
  description: 'Build APIs.',
};

describe('eligibility explanation', () => {
  it('builds structured eligibility criteria', () => {
    const criteria = buildEligibilityCriteria(internship);

    expect(criteria).toEqual({
      requiredSkills: ['JavaScript', 'Node.js', 'SQL'],
      minimumCGPA: 7,
      academicYear: 3,
      preferredDomain: 'Backend Development',
      preferredLocation: 'Chennai',
      internshipType: 'Onsite',
    });
  });

  it('builds a plain English eligibility explanation', () => {
    const explanation = buildEligibilityExplanation(internship);

    expect(explanation).toContain('Backend Development');
    expect(explanation).toContain('Chennai');
    expect(explanation).toContain('CGPA of at least 7');
    expect(explanation).toContain('academic year 3 or above');
  });
});
