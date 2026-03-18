const mongoose = require("mongoose");
require("dotenv").config();

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_TEST_URI);
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const collection in collections) {
    await collections[collection].deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});
