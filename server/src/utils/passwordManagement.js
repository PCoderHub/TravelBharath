const bcrypt = require("bcryptjs");

exports.createPasswordHash = async (password) => {
  const salt = 10;
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

exports.comparePasswordHash = async (password, hash) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
