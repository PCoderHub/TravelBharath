const { createPasswordHash } = require("../../src/utils/passwordManagement");
const User = require("../../src/models/User");
const request = require("supertest");
const app = require("../../src/index");

describe("POST /api/user/login", () => {
  beforeEach(async () => {
    await User.create({
      name: "Test Login User",
      email: "testloginuser@example.com",
      password: await createPasswordHash("Test@123"),
      role: "user",
    });
  });

  it("should login a user with valid credentials and return proper response", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "testloginuser@example.com",
      password: "Test@123",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.user).toHaveProperty("name", "Test Login User");
    expect(res.body.user).toHaveProperty("email", "testloginuser@example.com");
    expect(res.body.user).toHaveProperty("id", expect.any(String));
    expect(res.body.user.password).toBeUndefined();
    expect(res.body.token).toBeDefined();
    expect(res.body.token.split(".").length).toBe(3);
    expect(res.body.user._id).toBeUndefined();
    expect(res.body.user.id).toBeDefined();
  });

  it("should return error if password is wrong", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "testloginuser@example.com",
      password: "Test#123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should return error if user does not exist", async () => {
    const res = await request(app).post("/api/user/login").send({
      email: "testuser@example.com",
      password: "Test#123",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid credentials");
  });
});
