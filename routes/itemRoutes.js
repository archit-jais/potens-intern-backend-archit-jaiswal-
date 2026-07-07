const router = require('express').Router();

const itemController = require('../controllers/itemController');
const adminAuth = require('../middleware/adminAuth');
const asyncHandler = require('../middleware/asyncHandler');

router.get('/', asyncHandler(itemController.getItems));
router.get('/:id', asyncHandler(itemController.getItem));
router.post('/', adminAuth, asyncHandler(itemController.createItem));
router.put('/:id', adminAuth, asyncHandler(itemController.updateItem));
router.delete('/:id', adminAuth, asyncHandler(itemController.deleteItem));

module.exports = router;
