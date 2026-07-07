const router = require('express').Router();

const recommendationController = require('../controllers/recommendationController');
const asyncHandler = require('../middleware/asyncHandler');

router.post('/', asyncHandler(recommendationController.recommend));

module.exports = router;
