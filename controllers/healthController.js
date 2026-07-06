const { success } = require('../utils/apiResponse');

const check = (req, res) => {
  return success(res, {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  check,
};
