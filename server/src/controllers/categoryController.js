const asyncHandler = require("../middleware/asyncHandler");
const {
  createCategory,
  getCategoryByName,
} = require("../services/categoryServices");

const addCategory = asyncHandler(async (req, res, next) => {
  const { name, description = "" } = req.body;

  if (!!(await getCategoryByName(name))) {
    return next(createError("Category already exists", 400));
  }

  const category = await createCategory({ name, description });

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    category,
  });
});

module.exports = {
  addCategory,
};
