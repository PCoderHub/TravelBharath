const jwt = require("jsonwebtoken");
const RefreshToken = require("../models/RefreshToken");

exports.getSignedToken = (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "15m",
    },
  );

  return token;
};

exports.getRefreshToken = async (user) => {
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_REFRESH,
    {
      expiresIn: "7d",
    },
  );

  const expiresAt = new Date();

  if (process.env.NODE_ENV === "test") {
    expiresAt.setSeconds(expiresAt.getSeconds() + 30);
  } else {
    expiresAt.setDate(expiresAt.getDate() + 7);
  }

  await RefreshToken.create({ token, user: user.id, expiresAt });

  return token;
};

exports.verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_REFRESH);
  if (!decoded) {
    return null;
  }
  return decoded;
};

exports.verifyAccessToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  if (!decoded) {
    return null;
  }
  return decoded;
};

exports.isRefreshTokenValid = async (token) => {
  const storedToken = await RefreshToken.findOne({ token });
  return !!storedToken;
};

exports.deleteRefreshToken = async (token) => {
  await RefreshToken.deleteOne({ token });
};
