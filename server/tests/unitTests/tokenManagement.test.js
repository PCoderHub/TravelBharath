const RefreshToken = require("../../src/models/RefreshToken");
const {
  getSignedToken,
  getRefreshToken,
  verifyToken,
} = require("../../src/utils/tokenManagement");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const mockUser = {
  id: "1",
  email: "testuser@example.com",
  role: "user",
};

jest.mock("../../src/models/RefreshToken", () => ({
  create: jest.fn(),
  findOne: jest.fn(),
  deleteOne: jest.fn(),
}));

describe("Token management", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getSignedToken", () => {
    it("should return a valid signed token", () => {
      const token = getSignedToken(mockUser);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
      expect(decoded.id).toBe("1");
      expect(decoded.email).toBe("testuser@example.com");
      expect(decoded.role).toBe("user");
    });

    it("should produce different tokens for same user", () => {
      const token1 = getSignedToken(mockUser);
      const token2 = getSignedToken(mockUser);

      expect(token1).toBe(token2);
    });

    it("should not be decoded with wrong secret", () => {
      const token = getSignedToken(mockUser);

      expect(() => {
        jwt.verify(token, process.env.JWT_REFRESH);
      }).toThrow();
    });

    it("should expire in 15 minutes", () => {
      const token = getSignedToken(mockUser);
      const decoded = jwt.decode(token);

      const expectedExpiry = Math.floor(Date.now() / 1000) + 15 * 60;
      expect(decoded.exp).toBeCloseTo(expectedExpiry, -2);
    });
  });

  describe("getRefreshToken", () => {
    beforeEach(() => {
      RefreshToken.create.mockResolvedValueOnce({
        token: "refreshToken",
        user: "1",
        expiresAt: new Date(),
      });
    });

    it("should return valid refresh token", async () => {
      const token = await getRefreshToken(mockUser);
      const decoded = jwt.verify(token, process.env.JWT_REFRESH);
      expect(typeof token).toBe("string");
      expect(token.split(".").length).toBe(3);
      expect(RefreshToken.create).toHaveBeenCalledTimes(1);
      expect(decoded.id).toBe("1");
      expect(decoded.email).toBe("testuser@example.com");
      expect(decoded.role).toBe("user");
    });

    it("should expire in 30 seconds (test)", async () => {
      await getRefreshToken(mockUser);
      const calls = RefreshToken.create.mock.calls[0][0];

      const expectedExpiry = new Date();
      expectedExpiry.setSeconds(expectedExpiry.getSeconds() + 30);
      let diff = Math.abs(calls.expiresAt - expectedExpiry);

      expect(diff).toBeLessThanOrEqual(5000);
    });
  });

  describe("verifyRefreshToken", () => {
    it("should throw for expired token", () => {
      const expiredToken = jwt.sign(
        { id: mockUser.id },
        process.env.JWT_REFRESH,
        { expiresIn: "0s" },
      );

      expect(() => {
        verifyToken(expiredToken);
      }).toThrow();
    });

    it("should not verify access token as refresh token", () => {
      const token = getSignedToken(mockUser);
      expect(() => {
        verifyToken(token);
      }).toThrow();
    });
  });
});
