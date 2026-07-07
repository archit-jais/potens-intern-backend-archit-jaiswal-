const router = require('express').Router();
const healthRoutes = require('./healthRoutes');
const itemRoutes = require('./itemRoutes');

router.use('/health', healthRoutes);
router.use('/items', itemRoutes);

module.exports = router;
