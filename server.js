const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port} in ${env.nodeEnv} mode.`);
    });
  } catch (error) {
    console.error('Unable to start server:', error);
    process.exit(1);
  }
};

startServer();
