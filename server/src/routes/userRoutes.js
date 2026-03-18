const express = require("express");
const {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
} = require("../controllers/userController");
const {
  validateRegisteringUser,
  validateLoginUser,
  refreshTokenExists,
} = require("../middleware/validateUser");
const router = express.Router();

router.post("/register", validateRegisteringUser, registerUser);
router.post("/login", validateLoginUser, loginUser);
router.post("/refresh", refreshTokenExists, refreshToken);
router.post("/logout", refreshTokenExists, logoutUser);

module.exports = router;
