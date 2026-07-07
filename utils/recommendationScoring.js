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

const formatList = (values) => {
  if (!values || values.length === 0) {
    return '';
  }

  if (values.length === 1) {
    return values[0];
  }

  return `${values.slice(0, -1).join(', ')} and ${values[values.length - 1]}`;
};

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
    missingSkills: normalizedRequiredSkills.filter((skill) => !normalizedProfileSkills.has(skill)),
  };
};

const buildScoreBreakdown = (item, matchedFields) => ({
  skills: {
    score: matchedFields.skills.score,
    maxScore: WEIGHTS.skills,
    matched: matchedFields.skills.matched,
    missing: matchedFields.skills.missing,
    required: matchedFields.skills.required,
  },
  domain: {
    score: matchedFields.domain ? WEIGHTS.domain : 0,
    maxScore: WEIGHTS.domain,
    matched: matchedFields.domain,
    expected: item.domain,
  },
  cgpa: {
    score: matchedFields.cgpa ? WEIGHTS.cgpa : 0,
    maxScore: WEIGHTS.cgpa,
    matched: matchedFields.cgpa,
    minimumRequired: Number(item.minimumCGPA),
  },
  location: {
    score: matchedFields.location ? WEIGHTS.location : 0,
    maxScore: WEIGHTS.location,
    matched: matchedFields.location,
    expected: item.location,
  },
  academicYear: {
    score: matchedFields.academicYear ? WEIGHTS.academicYear : 0,
    maxScore: WEIGHTS.academicYear,
    matched: matchedFields.academicYear,
    minimumRequired: Number(item.academicYear),
  },
});

const buildExplanation = (item, matchedFields, scoreBreakdown) => {
  const positives = [];
  const gaps = [];

  if (matchedFields.skills.matched.length > 0) {
    positives.push(
      `${matchedFields.skills.matched.length} of ${matchedFields.skills.required.length} required skills match (${formatList(
        matchedFields.skills.matched
      )})`
    );

    if (matchedFields.skills.missing.length > 0) {
      gaps.push(`missing required skills: ${formatList(matchedFields.skills.missing)}`);
    }
  } else {
    gaps.push('the required skills do not overlap with the profile');
  }

  if (matchedFields.domain) {
    positives.push(`the domain matches ${item.domain}`);
  } else {
    gaps.push(`the role domain is ${item.domain}`);
  }

  if (matchedFields.cgpa) {
    positives.push(`the CGPA requirement of ${Number(item.minimumCGPA)} is met`);
  } else {
    gaps.push(`the minimum CGPA is ${Number(item.minimumCGPA)}`);
  }

  if (matchedFields.location) {
    positives.push(`the location matches ${item.location}`);
  } else {
    gaps.push(`the location is ${item.location}`);
  }

  if (matchedFields.academicYear) {
    positives.push(`the academic year requirement is met`);
  } else {
    gaps.push(`the role requires academic year ${Number(item.academicYear)} or above`);
  }

  const positiveSentence =
    positives.length > 0
      ? `Strong fit signals: ${formatList(positives)}.`
      : 'This role has limited alignment with the submitted profile.';

  const gapSentence = gaps.length > 0 ? `Remaining gaps: ${formatList(gaps)}.` : 'There are no major eligibility gaps.';

  return `${positiveSentence} ${gapSentence} Final score: ${scoreBreakdown.total.score}/${scoreBreakdown.total.maxScore}.`;
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
      missing: skillMatch.missingSkills || [],
      required: skillMatch.requiredSkills,
      score: skillMatch.score,
    },
    domain: domainMatched,
    cgpa: cgpaMatched,
    location: locationMatched,
    academicYear: academicYearMatched,
  };

  const scoreBreakdown = {
    ...buildScoreBreakdown(item, matchedFields),
    total: {
      score,
      maxScore: 100,
    },
  };

  return {
    internship: item,
    score,
    scoreBreakdown,
    matchedFields,
    explanation: buildExplanation(item, matchedFields, scoreBreakdown),
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
