const Category = require("../models/Category");

const getCategoryByName = async (name) => {
  return await Category.findOne({ name });
};

const createCategory = async (category) => {
  return await Category.create(category);
};

module.exports = {
  getCategoryByName,
  createCategory,
};
