const explainService = require('../services/explainService');
const { success } = require('../utils/apiResponse');
const createHttpError = require('../utils/createHttpError');

const explainItem = async (req, res) => {
  const explanation = await explainService.explainItem(req.params.id);

  if (!explanation) {
    throw createHttpError(404, 'Item not found');
  }

  return success(res, explanation);
};

module.exports = {
  explainItem,
};
