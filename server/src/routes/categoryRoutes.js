const express = require("express");
const { addCategory } = require("../controllers/categoryController");
const authMiddleware = require("../middleware/authMiddleware");
const { validateCategoryObject } = require("../middleware/validateCategory");
const router = express.Router();

router.post("/", authMiddleware, validateCategoryObject, addCategory);
// router.get("/");
// router.get("/:id");
// router.patch("/:id");
// router.delete("/:id");

module.exports = router;
