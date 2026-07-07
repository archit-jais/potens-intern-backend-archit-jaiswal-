const router = require('express').Router();
const healthRoutes = require('./healthRoutes');
const itemRoutes = require('./itemRoutes');
const recommendationRoutes = require('./recommendationRoutes');

router.use('/health', healthRoutes);
router.use('/items', itemRoutes);
router.use('/recommend', recommendationRoutes);

module.exports = router;
