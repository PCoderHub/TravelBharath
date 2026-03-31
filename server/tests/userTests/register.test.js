const request = require("supertest");
const app = require("../../src/index");
const User = require("../../src/models/User");
const { createPasswordHash } = require("../../src/utils/passwordManagement");

describe("POST /api/user/register", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      email: "testuser@example.com",
      password: "Test#123",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty("name", "Test User");
    expect(res.body.user).toHaveProperty("email", "testuser@example.com");
    expect(res.body.user).toHaveProperty("id", expect.any(String));
  });

  it("should always assign role as user", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User 1",
      email: "test@example.com",
      password: "Test#123",
      role: "admin",
    });

    expect(res.body.user).toHaveProperty("role", "user");
  });

  it("should not return password and should have id instead of _id in response", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User 2",
      email: "testu@example.com",
      password: "Test#123",
    });

    expect(res.body.user).not.toHaveProperty("password");
    expect(res.body.user).not.toHaveProperty("_id");
    expect(res.body.user).toHaveProperty("id", expect.any(String));
  });

  it("should have hashed password in database", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User 3",
      email: "testv@example.com",
      password: "Test#123",
    });

    const userInDB = await User.findOne({ email: "testv@example.com" }).select(
      "+password",
    );

    expect(userInDB.password).not.toBe("Test#123");
    expect(userInDB.password).toMatch(/^\$2[ab]\$/);
  });

  it("should return error if user already exists", async () => {
    await User.create({
      name: "Test User",
      email: "duplicate@example.com",
      password: await createPasswordHash("Test#123"),
      role: "user",
    });

    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      email: "duplicate@example.com",
      password: "Test#123",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return error if email is invalid", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      email: "abcd.com",
      password: "password",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email address");
  });

  it("should return error if password is invalid", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      email: "testw@example.com",
      password: "password",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe(
      "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    );
  });

  it("should return error if name is not provided", async () => {
    const res = await request(app).post("/api/user/register").send({
      email: "testx@example.com",
      password: "password",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return error if email is not provided", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      password: "password",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return error if password is not provided", async () => {
    const res = await request(app).post("/api/user/register").send({
      name: "Test User",
      email: "testy@example.com",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return error if data is empty", async () => {
    const res = await request(app).post("/api/user/register").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("All fields are required");
  });

  it("should return error if data is not provided", async () => {
    const res = await request(app).post("/api/user/register").send();

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("No data found");
  });
});
