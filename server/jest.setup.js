// This runs after each test file is set up — handles cleanup between tests
const mongoose = require("mongoose");
require("dotenv").config();

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_TEST_URI);
    console.log("DB Connected", process.env.MONGODB_TEST_URI);
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
