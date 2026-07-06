require('dotenv').config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  corsOrigin: process.env.CORS_ORIGIN || '*',
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: toNumber(process.env.DB_PORT, 3306),
    name: process.env.DB_NAME || 'potens_q2',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
  },
  adminToken: process.env.ADMIN_TOKEN || '',
};
