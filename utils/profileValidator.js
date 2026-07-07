const createHttpError = require('./createHttpError');

const requiredFields = ['skills', 'cgpa', 'preferredDomain', 'preferredLocation', 'academicYear'];

const validateRecommendationProfile = (profile) => {
  const missingFields = requiredFields.filter((field) => profile[field] === undefined || profile[field] === null);

  if (missingFields.length > 0) {
    throw createHttpError(400, `Missing required field(s): ${missingFields.join(', ')}`);
  }

  if (!Array.isArray(profile.skills)) {
    throw createHttpError(400, 'skills must be an array');
  }

  if (profile.skills.length === 0) {
    throw createHttpError(400, 'skills must contain at least one skill');
  }

  if (Number.isNaN(Number(profile.cgpa)) || Number(profile.cgpa) < 0 || Number(profile.cgpa) > 10) {
    throw createHttpError(400, 'cgpa must be a number between 0 and 10');
  }

  if (Number.isNaN(Number(profile.academicYear)) || Number(profile.academicYear) < 1) {
    throw createHttpError(400, 'academicYear must be a positive number');
  }

  return {
    skills: profile.skills,
    cgpa: Number(profile.cgpa),
    preferredDomain: String(profile.preferredDomain).trim(),
    preferredLocation: String(profile.preferredLocation).trim(),
    academicYear: Number(profile.academicYear),
  };
};

module.exports = {
  validateRecommendationProfile,
};
