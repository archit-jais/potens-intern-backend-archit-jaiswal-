const { Internship } = require('../models');
const { rankInternships } = require('../utils/recommendationScoring');

const getTopMatches = async (profile) => {
  const internships = await Internship.findAll();
  return rankInternships(profile, internships, 3);
};

module.exports = {
  getTopMatches,
};
