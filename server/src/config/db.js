const mongoose = require("mongoose");
const { logger } = require("../utils/logger");

const MONGODB_URI = process.env.MONGO_URI;

const dbConnect = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("DB Connected");
  } catch (error) {
    console.error(error);
  }
};
module.exports = { dbConnect };
