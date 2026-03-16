const {
  createPasswordHash,
  comparePasswordHash,
} = require("../../src/utils/passwordManagement");

describe("passwordManagement", () => {
  it("should return different hash for the same password", async () => {
    const password = "password";
    const hash1 = await createPasswordHash(password);
    const hash2 = await createPasswordHash(password);

    expect(hash1).not.toBe(hash2);
  });

  it("should compare password correctly", async () => {
    const password = "password";
    const hash = await createPasswordHash(password);
    const isMatch = await comparePasswordHash(password, hash);

    expect(isMatch).toBe(true);
  });
});
