const { logger } = require("../utils/logger");

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = err.message || "Internal Server error";

  const requestContext = {
    method: req.method,
    path: req.originalUrl,
    body: req.body,
    params: req.params,
    query: req.query,
    ip: req.ip,
    user: req.user?.id || "unauthenticated",
  };

  logger.error(message, { error: err, request: requestContext });

  if (err.isOperational) {
    return res.status(statusCode).json({
      message,
      success: false,
    });
  }

  return res.status(500).json({
    message: "Internal Server error",
    success: false,
  });
};

module.exports = errorHandler;
