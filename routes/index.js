const router = require('express').Router();
const healthRoutes = require('./healthRoutes');
const itemRoutes = require('./itemRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const explainRoutes = require('./explainRoutes');

router.use('/health', healthRoutes);
router.use('/items', itemRoutes);
router.use('/recommend', recommendationRoutes);
router.use('/explain', explainRoutes);

module.exports = router;
