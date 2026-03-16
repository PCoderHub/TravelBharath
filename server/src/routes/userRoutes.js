const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const {
  validateRegisteringUser,
  validateLoginUser,
} = require("../middleware/validateUser");
const router = express.Router();

router.post("/register", validateRegisteringUser, registerUser);
router.post("/login", validateLoginUser, loginUser);
// router.post("/logout");

module.exports = router;
