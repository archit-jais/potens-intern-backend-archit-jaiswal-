const env = require('../config/env');
const createHttpError = require('../utils/createHttpError');

const adminAuth = (req, res, next) => {
  const token = req.header('x-admin-token');

  if (!env.adminToken || token !== env.adminToken) {
    return next(createHttpError(401, 'Admin token is missing or invalid'));
  }

  return next();
};

module.exports = adminAuth;
