const { error } = require('../utils/apiResponse');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = statusCode === 500 ? 'Internal server error' : err.message;
  let details;

  if (err.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = 'Validation failed';
    details = err.errors.map((validationError) => validationError.message);
  }

  if (env.nodeEnv !== 'test') {
    console.error(err);
  }

  return error(res, message, statusCode, details || (env.nodeEnv === 'development' ? err.stack : undefined));
};

module.exports = errorHandler;
