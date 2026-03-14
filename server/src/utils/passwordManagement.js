const bcrypt = require("bcryptjs");

exports.createPasswordHash = async (password) => {
  const salt = 10;
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};
