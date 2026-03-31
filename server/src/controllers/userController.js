const asyncHandler = require("../middleware/asyncHandler");
const { saveUser, getUserByEmail } = require("../services/userServices");
const { createError } = require("../utils/createError");
const {
  createPasswordHash,
  comparePasswordHash,
} = require("../utils/passwordManagement");
const {
  getSignedToken,
  getRefreshToken,
  verifyToken,
  isRefreshTokenValid,
  deleteRefreshToken,
} = require("../utils/tokenManagement");

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

  const access = getSignedToken({
    id: user.id,
    email: user.email,
    role: user.role,
  });

  const refresh = await getRefreshToken({
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
    access,
    refresh,
  });
});

const refreshToken = asyncHandler(async (req, res, next) => {
  const { refresh } = req.body;

  const isValid = await isRefreshTokenValid(refresh);

  if (!isValid) {
    return next(createError("Invalid or expired refresh token", 401));
  }

  const decoded = verifyToken(refresh);

  if (!decoded) {
    return next(createError("Invalid refresh token", 401));
  }

  const access = getSignedToken({
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  });

  res.status(200).json({
    success: true,
    message: "Token refreshed successfully",
    access,
  });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const { refresh } = req.body;

  const isValid = await isRefreshTokenValid(refresh);

  if (!isValid) {
    return next(createError("Automatic logout", 401));
  }

  await deleteRefreshToken(refresh);

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  });
});

module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  logoutUser,
};
