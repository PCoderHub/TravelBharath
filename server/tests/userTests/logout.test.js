const RefreshToken = require("../../src/models/RefreshToken");
const User = require("../../src/models/User");
const request = require("supertest");
const { createPasswordHash } = require("../../src/utils/passwordManagement");
const app = require("../../src/index");

const loginTestUser = async () => {
  const res = await request(app).post("/api/user/login").send({
    email: "testlogout@example.com",
    password: "Test@123",
  });
  return {
    access: res.body.access,
    refresh: res.body.refresh,
  };
};

describe("POST /api/user/logout", () => {
  beforeEach(async () => {
    await User.create({
      name: "Test Logout User",
      email: "testlogout@example.com",
      password: await createPasswordHash("Test@123"),
      role: "user",
    });
  });

  it("should logout successfully with valid refresh token", async () => {
    const { refresh } = await loginTestUser();

    const res = await request(app).post("/api/user/logout").send({ refresh });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("User logged out successfully");
  });

  it("should delete refresh token from DB on logout", async () => {
    const { refresh } = await loginTestUser();

    await request(app).post("/api/user/logout").send({ refresh });

    const tokenInDB = await RefreshToken.findOne({ token: refresh });
    expect(tokenInDB).toBeNull();
  });

  it("should return 401 if refresh token is missing", async () => {
    const res = await request(app).post("/api/user/logout").send({});

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Refresh token not provided");
  });

  it("should return 401 if refresh token is invalid", async () => {
    const res = await request(app)
      .post("/api/user/logout")
      .send({ refresh: "invalid.token.string" });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should not be able to refresh after logout", async () => {
    const { refresh } = await loginTestUser();

    await request(app).post("/api/user/logout").send({ refresh });

    const res = await request(app).post("/api/user/refresh").send({ refresh });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid or expired refresh token");
  });

  it("should not be able to logout twice with same token", async () => {
    const { refresh } = await loginTestUser();

    await request(app).post("/api/user/logout").send({ refresh });

    const res = await request(app).post("/api/user/logout").send({ refresh });

    expect(res.statusCode).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should only invalidate the specific token used for logout", async () => {
    const session1 = await loginTestUser();
    const session2 = await loginTestUser();

    await request(app)
      .post("/api/user/logout")
      .send({ refresh: session1.refresh });

    const res = await request(app)
      .post("/api/user/refresh")
      .send({ refresh: session2.refresh });

    expect(res.statusCode).toBe(200);
    expect(res.body.access).toBeDefined();
  });
});
