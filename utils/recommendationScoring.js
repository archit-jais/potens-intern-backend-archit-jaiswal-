const WEIGHTS = {
  skills: 40,
  domain: 25,
  cgpa: 15,
  location: 10,
  academicYear: 10,
};

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const normalizeList = (values) => {
  if (Array.isArray(values)) {
    return values.map(normalizeText).filter(Boolean);
  }

  if (typeof values === 'string') {
    try {
      const parsed = JSON.parse(values);
      if (Array.isArray(parsed)) {
        return parsed.map(normalizeText).filter(Boolean);
      }
    } catch (error) {
      return values.split(',').map(normalizeText).filter(Boolean);
    }
  }

  return [];
};

const roundScore = (score) => Math.round(score * 100) / 100;

const calculateSkillMatch = (profileSkills, requiredSkills) => {
  const normalizedProfileSkills = new Set(normalizeList(profileSkills));
  const normalizedRequiredSkills = normalizeList(requiredSkills);
  const matchedSkills = normalizedRequiredSkills.filter((skill) => normalizedProfileSkills.has(skill));

  if (normalizedRequiredSkills.length === 0) {
    return {
      score: WEIGHTS.skills,
      matchedSkills: [],
      requiredSkills: [],
    };
  }

  return {
    score: roundScore((matchedSkills.length / normalizedRequiredSkills.length) * WEIGHTS.skills),
    matchedSkills,
    requiredSkills: normalizedRequiredSkills,
  };
};

const buildExplanation = (item, matchedFields) => {
  const skillSummary =
    matchedFields.skills.matched.length > 0
      ? `It matches ${matchedFields.skills.matched.length} of ${matchedFields.skills.required.length} required skills: ${matchedFields.skills.matched.join(', ')}`
      : `It does not match the listed required skills`;

  const domainSummary = matchedFields.domain
    ? `the preferred domain matches ${item.domain}`
    : `the domain is ${item.domain}, which is different from the preference`;

  const cgpaSummary = matchedFields.cgpa
    ? `the candidate meets the minimum CGPA of ${Number(item.minimumCGPA)}`
    : `the candidate does not meet the minimum CGPA of ${Number(item.minimumCGPA)}`;

  const locationSummary = matchedFields.location
    ? `the preferred location matches ${item.location}`
    : `the location is ${item.location}, which is different from the preference`;

  const yearSummary = matchedFields.academicYear
    ? `the candidate's academic year meets the minimum year requirement`
    : `the candidate's academic year is below the requirement`;

  return `${skillSummary}. Also, ${domainSummary}, ${cgpaSummary}, ${locationSummary}, and ${yearSummary}.`;
};

const scoreInternship = (profile, internship) => {
  const item = typeof internship.toJSON === 'function' ? internship.toJSON() : internship;
  const skillMatch = calculateSkillMatch(profile.skills, item.requiredSkills);
  const domainMatched = normalizeText(profile.preferredDomain) === normalizeText(item.domain);
  const cgpaMatched = Number(profile.cgpa) >= Number(item.minimumCGPA);
  const locationMatched = normalizeText(profile.preferredLocation) === normalizeText(item.location);
  const academicYearMatched = Number(profile.academicYear) >= Number(item.academicYear);

  const score = roundScore(
    skillMatch.score +
      (domainMatched ? WEIGHTS.domain : 0) +
      (cgpaMatched ? WEIGHTS.cgpa : 0) +
      (locationMatched ? WEIGHTS.location : 0) +
      (academicYearMatched ? WEIGHTS.academicYear : 0)
  );

  const matchedFields = {
    skills: {
      matched: skillMatch.matchedSkills,
      required: skillMatch.requiredSkills,
      score: skillMatch.score,
    },
    domain: domainMatched,
    cgpa: cgpaMatched,
    location: locationMatched,
    academicYear: academicYearMatched,
  };

  return {
    internship: item,
    score,
    matchedFields,
    explanation: buildExplanation(item, matchedFields),
  };
};

const rankInternships = (profile, internships, limit = 3) => {
  return internships
    .map((internship) => scoreInternship(profile, internship))
    .filter((recommendation) => recommendation.score > 0)
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      if (second.matchedFields.skills.matched.length !== first.matchedFields.skills.matched.length) {
        return second.matchedFields.skills.matched.length - first.matchedFields.skills.matched.length;
      }

      if (Number(second.internship.stipend) !== Number(first.internship.stipend)) {
        return Number(second.internship.stipend) - Number(first.internship.stipend);
      }

      return Number(first.internship.id) - Number(second.internship.id);
    })
    .slice(0, limit);
};

module.exports = {
  WEIGHTS,
  normalizeList,
  scoreInternship,
  rankInternships,
};
