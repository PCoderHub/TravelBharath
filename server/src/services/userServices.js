const User = require("../models/User");

const saveUser = async (user) => {
  const savedUser = await User.create(user);
  return savedUser;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

module.exports = {
  saveUser,
  getUserByEmail,
};
