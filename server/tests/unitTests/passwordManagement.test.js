const { createPasswordHash } = require("../../src/utils/passwordManagement");

describe("passwordManagement", () => {
  it("should return different hash for the same password", () => {
    const password = "password";
    const hash1 = createPasswordHash(password);
    const hash2 = createPasswordHash(password);

    expect(hash1).not.toBe(hash2);
  });
});
