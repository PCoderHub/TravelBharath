const asyncHandler = require("../middleware/asyncHandler");
const { saveUser, getUserByEmail } = require("../services/userServices");
const { createError } = require("../utils/createError");
const { createPasswordHash } = require("../utils/passwordManagement");

const registerUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!!(await getUserByEmail(email))) {
    return next(createError("User already exists", 400));
  }

  const passwordHash = await createPasswordHash(password);
  const user = await saveUser({
    ...req.body,
    password: passwordHash,
    role: "user",
  }); // ensure duplicate admins are not created

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user,
  });
});

module.exports = {
  registerUser,
};
