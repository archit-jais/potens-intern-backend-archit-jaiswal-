const { error } = require('../utils/apiResponse');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal server error' : err.message;

  if (env.nodeEnv !== 'test') {
    console.error(err);
  }

  return error(res, message, statusCode, env.nodeEnv === 'development' ? err.stack : undefined);
};

module.exports = errorHandler;
