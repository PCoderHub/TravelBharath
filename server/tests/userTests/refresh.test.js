const User = require("../../src/models/User");
const { createPasswordHash } = require("../../src/utils/passwordManagement");
const request = require("supertest");
const app = require("../../src/index");

const loginTestUser = async () => {
  const res = await request(app).post("/api/user/login").send({
    email: "testrefreshuser@example.com",
    password: "Test@123",
  });
  return {
    access: res.body.access,
    refresh: res.body.refresh,
  };
};

describe("POST /api/user/refresh", () => {
  beforeEach(async () => {
    await User.create({
      name: "Test Refresh User",
      email: "testrefreshuser@example.com",
      password: await createPasswordHash("Test@123"),
      role: "user",
    });
  });

  it("should return a new access token", async () => {
    const { refresh } = await loginTestUser();

    const res = await request(app).post("/api/user/refresh").send({
      refresh,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.access).toBeDefined();
    expect(res.body.access.split(".").length).toBe(3);
  });

  it("should return 401 if refresh token is missing", async () => {
    const res = await request(app).post("/api/user/refresh").send({});

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Refresh token not provided");
  });

  it("should return 401 if refresh token is invalid", async () => {
    const res = await request(app)
      .post("/api/user/refresh")
      .send({ refresh: "invalid.token.string" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 401 if refresh token is not in DB", async () => {
    const jwt = require("jsonwebtoken");
    const fakeRefresh = jwt.sign(
      { id: "507f1f77bcf86cd799439011", email: "fake@test.com", role: "user" },
      process.env.JWT_REFRESH,
      { expiresIn: "7d" },
    );

    const res = await request(app)
      .post("/api/user/refresh")
      .send({ refresh: fakeRefresh });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid or expired refresh token");
  });

  it("should return a different access token on each refresh", async () => {
    const { refresh } = await loginTestUser();

    const res1 = await request(app).post("/api/user/refresh").send({ refresh });

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const res2 = await request(app).post("/api/user/refresh").send({ refresh });

    expect(res1.body.access).not.toBe(res2.body.access);
  });
});
