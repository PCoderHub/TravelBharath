const { createError } = require("../utils/createError");

const validateCategoryObject = (req, res, next) => {
  if (!req.body) {
    return next(createError("No data found", 400));
  }
  if (!req.body.name) {
    return next(createError("Category name is required", 400));
  }
  next();
};

module.exports = {
  validateCategoryObject,
};
