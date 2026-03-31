import { describe, expect, it } from "vitest";
import { handleError } from "../../helpers/handleError";

describe("handleError", () => {
  it("should handle timeout error", () => {
    const error = { code: "ECONNABORTED" };
    const result = handleError(error);

    expect(result.message).toBe("Request timed out. Please try again.");
    expect(result.status).toBe(408);
  });

  it("should extract message from server errors", () => {
    const error = {
      response: {
        data: {
          message: "Invalid credentials",
        },
        status: 401,
      },
    };

    const result = handleError(error);

    expect(result.message).toBe("Invalid credentials");
    expect(result.status).toBe(401);
    expect(result.isAuthError).toBe(true);
  });

  it("should return isAuthError false for non-401", () => {
    const error = {
      response: {
        data: {
          message: "Not found",
        },
        status: 404,
      },
    };
    const result = handleError(error);

    expect(result.isAuthError).toBe(false);
  });

  it("should fallback to generic message if nothing available", () => {
    const result = handleError({});
    expect(result.message).toBe("Something went wrong");
  });
});
