const asyncHandler = require("../middleware/asyncHandler");
const { saveUser, getUserByEmail } = require("../services/userServices");
const { createError } = require("../utils/createError");
const {
  createPasswordHash,
  comparePasswordHash,
} = require("../utils/passwordManagement");
const { getSignedToken } = require("../utils/tokenManagement");

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

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await getUserByEmail(email, true);

  if (!user || !(await comparePasswordHash(password, user.password))) {
    return next(createError("Invalid credentials", 401));
  }

  const token = getSignedToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  res.status(200).json({
    success: true,
    message: "User logged in successfully",
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});

module.exports = {
  registerUser,
  loginUser,
};
