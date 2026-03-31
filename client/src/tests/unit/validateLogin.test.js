import { describe, expect, it } from "vitest";
import { validateLogin } from "../../utils/validators/validateLogin";

describe("validateLogin", () => {
  it("should return empty object for valid inputs", () => {
    const errors = validateLogin({
      email: "test@test.com",
      password: "Test@1234",
    });

    expect(errors).toEqual({});
  });

  it("should return error if email is missing", () => {
    const errors = validateLogin({
      email: "",
      password: "Test@1234",
    });

    expect(errors.email).toBe("Email is required");
  });

  it("should return error if email is invalid", () => {
    const errors = validateLogin({
      email: "testinvalid",
      password: "Test@1234",
    });

    expect(errors.email).toBe("Invalid email address");
  });

  it("should return error if password is missing", () => {
    const errors = validateLogin({
      email: "test@test.com",
      password: "",
    });

    expect(errors.password).toBe("Password is required");
  });

  it("should return error if password is invalid", () => {
    const errors = validateLogin({
      email: "test@test.com",
      password: "test",
    });

    expect(errors.password).toBe("Password must be at least 8 characters long");
  });

  it("should return multiple errors at once", () => {
    const errors = validateLogin({
      email: "",
      password: "test",
    });

    expect(errors.email).toBeDefined();
    expect(errors.password).toBeDefined();
  });
});
