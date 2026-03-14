const express = require("express");
const { registerUser } = require("../controllers/userController");
const { validateUser } = require("../middleware/validateUser");
const router = express.Router();

router.post("/register", validateUser, registerUser);
// router.post("/login");
// router.post("/logout");

module.exports = router;
