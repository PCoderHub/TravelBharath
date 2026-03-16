const User = require("../models/User");

const saveUser = async (user) => {
  const savedUser = await User.create(user);
  return savedUser;
};

const getUserByEmail = async (email, withPassword = false) => {
  const user = User.findOne({ email });

  if (withPassword) user.select("+password");
  return await user;
};

module.exports = {
  saveUser,
  getUserByEmail,
};
