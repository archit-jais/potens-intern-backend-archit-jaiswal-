const itemService = require('./itemService');
const { buildEligibilityCriteria, buildEligibilityExplanation } = require('../utils/eligibilityExplanation');

const explainItem = async (id) => {
  const internship = await itemService.getItemById(id);

  if (!internship) {
    return null;
  }

  const item = typeof internship.toJSON === 'function' ? internship.toJSON() : internship;

  return {
    internship: item,
    eligibilityCriteria: buildEligibilityCriteria(item),
    explanation: buildEligibilityExplanation(item),
  };
};

module.exports = {
  explainItem,
};
