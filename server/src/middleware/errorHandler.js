const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server error";

  logger.error(message, err);

  if (err.isOperational) {
    return res.status(statusCode).json({
      message,
      success: false,
    });
  }
};

module.exports = errorHandler;
