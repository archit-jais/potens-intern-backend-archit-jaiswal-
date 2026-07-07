const itemService = require('../services/itemService');
const { success } = require('../utils/apiResponse');
const createHttpError = require('../utils/createHttpError');

const getItems = async (req, res) => {
  const items = await itemService.getAllItems();
  return success(res, items);
};

const getItem = async (req, res) => {
  const item = await itemService.getItemById(req.params.id);

  if (!item) {
    throw createHttpError(404, 'Item not found');
  }

  return success(res, item);
};

const createItem = async (req, res) => {
  const item = await itemService.createItem(req.body);
  return success(res, item, 201);
};

const updateItem = async (req, res) => {
  const item = await itemService.updateItem(req.params.id, req.body);

  if (!item) {
    throw createHttpError(404, 'Item not found');
  }

  return success(res, item);
};

const deleteItem = async (req, res) => {
  const deleted = await itemService.deleteItem(req.params.id);

  if (!deleted) {
    throw createHttpError(404, 'Item not found');
  }

  return res.status(204).send();
};

module.exports = {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
};
