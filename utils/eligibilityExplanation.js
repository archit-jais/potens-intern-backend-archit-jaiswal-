const normalizeSkills = (requiredSkills) => {
  if (Array.isArray(requiredSkills)) {
    return requiredSkills;
  }

  if (typeof requiredSkills === 'string') {
    try {
      const parsed = JSON.parse(requiredSkills);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return requiredSkills.split(',').map((skill) => skill.trim()).filter(Boolean);
    }
  }

  return [];
};

const SCORE_WEIGHTS = {
  skills: 40,
  domain: 25,
  cgpa: 15,
  location: 10,
  academicYear: 10,
};

const formatList = (values) => {
  if (!values || values.length === 0) {
    return '';
  }

  if (values.length === 1) {
    return values[0];
  }

  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
};

const buildEligibilityCriteria = (internship) => {
  const item = typeof internship.toJSON === 'function' ? internship.toJSON() : internship;

  return {
    requiredSkills: normalizeSkills(item.requiredSkills),
    minimumCGPA: Number(item.minimumCGPA),
    academicYear: Number(item.academicYear),
    preferredDomain: item.domain,
    preferredLocation: item.location,
    internshipType: item.internshipType,
  };
};

const buildScoreBreakdown = (internship) => {
  const criteria = buildEligibilityCriteria(internship);

  return {
    skills: {
      maxScore: SCORE_WEIGHTS.skills,
      rule: 'Awarded proportionally based on how many required skills match the student profile.',
      required: criteria.requiredSkills,
    },
    domain: {
      maxScore: SCORE_WEIGHTS.domain,
      rule: `Awarded when the preferred domain matches ${criteria.preferredDomain}.`,
    },
    cgpa: {
      maxScore: SCORE_WEIGHTS.cgpa,
      rule: `Awarded when the student CGPA is at least ${criteria.minimumCGPA}.`,
    },
    location: {
      maxScore: SCORE_WEIGHTS.location,
      rule: `Awarded when the preferred location matches ${criteria.preferredLocation}.`,
    },
    academicYear: {
      maxScore: SCORE_WEIGHTS.academicYear,
      rule: `Awarded when the student is in academic year ${criteria.academicYear} or above.`,
    },
    total: {
      maxScore: 100,
    },
  };
};

const buildEligibilityExplanation = (internship) => {
  const item = typeof internship.toJSON === 'function' ? internship.toJSON() : internship;
  const criteria = buildEligibilityCriteria(item);
  const skillsText = criteria.requiredSkills.length > 0 ? formatList(criteria.requiredSkills) : 'the listed role skills';

  return `Best-fit signals for this role are ${criteria.preferredDomain} interest, availability for ${criteria.preferredLocation}, and skills in ${skillsText}. To be eligible, a student should have a CGPA of at least ${criteria.minimumCGPA} and be in academic year ${criteria.academicYear} or above. This is a ${criteria.internshipType} internship at ${item.company} with a monthly stipend of INR ${Number(item.stipend)}.`;
};

module.exports = {
  buildEligibilityCriteria,
  buildEligibilityExplanation,
  buildScoreBreakdown,
};
