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

const buildEligibilityExplanation = (internship) => {
  const item = typeof internship.toJSON === 'function' ? internship.toJSON() : internship;
  const criteria = buildEligibilityCriteria(item);
  const skillsText = criteria.requiredSkills.length > 0 ? criteria.requiredSkills.join(', ') : 'the listed role skills';

  return `This internship is best suited for students interested in ${criteria.preferredDomain} roles in ${criteria.preferredLocation}. A candidate should have skills in ${skillsText}, a CGPA of at least ${criteria.minimumCGPA}, and should be in academic year ${criteria.academicYear} or above. The role is offered as a ${criteria.internshipType} internship with a monthly stipend of INR ${Number(item.stipend)}.`;
};

module.exports = {
  buildEligibilityCriteria,
  buildEligibilityExplanation,
};
