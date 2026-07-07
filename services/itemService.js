const { Internship } = require('../models');

const getAllItems = async () => {
  return Internship.findAll({
    order: [['createdAt', 'DESC']],
  });
};

const getItemById = async (id) => {
  return Internship.findByPk(id);
};

const createItem = async (payload) => {
  return Internship.create(payload);
};

const updateItem = async (id, payload) => {
  const item = await Internship.findByPk(id);

  if (!item) {
    return null;
  }

  return item.update(payload);
};

const deleteItem = async (id) => {
  const item = await Internship.findByPk(id);

  if (!item) {
    return false;
  }

  await item.destroy();
  return true;
};

module.exports = {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
};
