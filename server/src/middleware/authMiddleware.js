const { createError } = require("../utils/createError");
const { verifyAccessToken } = require("../utils/tokenManagement");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return next(createError("Unauthorized", 401));
  }

  const decoded = verifyAccessToken(token);

  if (!decoded) {
    return next(createError("Unauthorized", 401));
  }

  if (decoded.role !== "admin") {
    return next(createError("Unauthorized", 401));
  }

  req.user = decoded;
  next();
};

module.exports = authMiddleware;
