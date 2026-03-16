const { createError } = require("../utils/createError");

exports.validateRegisteringUser = (req, res, next) => {
  if (!req.body) {
    return next(createError("No data found", 400));
  }
  if (!req.body.name || !req.body.email || !req.body.password) {
    return next(createError("All fields are required", 400));
  }
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!emailRegex.test(req.body.email)) {
    return next(createError("Invalid email address", 400));
  }
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
  if (!passwordRegex.test(req.body.password)) {
    return next(
      createError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        400,
      ),
    );
  }
  next();
};

exports.validateLoginUser = (req, res, next) => {
  if (!req.body) {
    return next(createError("No data found", 400));
  }

  if (!req.body.email || !req.body.password) {
    return next(createError("All fields are required", 400));
  }

  next();
};
