const router = require('express').Router();

const explainController = require('../controllers/explainController');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/:id', asyncHandler(explainController.explainItem));

module.exports = router;
