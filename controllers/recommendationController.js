const recommendationService = require('../services/recommendationService');
const { success } = require('../utils/apiResponse');
const { validateRecommendationProfile } = require('../utils/profileValidator');

const recommend = async (req, res) => {
  const profile = validateRecommendationProfile(req.body);
  const recommendations = await recommendationService.getTopMatches(profile);

  return success(res, {
    profile,
    recommendations,
  });
};

module.exports = {
  recommend,
};
