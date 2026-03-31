import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { AuthProvider } from "../../context/AuthContext";
import TestComponent from "../helpers/TestComponent";

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should start unauthenticated with no stored data", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user").textContent).toBe("no user");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
  });

  it("should set user and tokens on login", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    act(() => {
      screen.getByText("Login").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("Test");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
    expect(screen.getByTestId("isAdmin").textContent).toBe("true");
  });

  it("should save to localStorage on login", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    act(() => {
      screen.getByText("Login").click();
    });

    expect(localStorage.getItem("access")).toBe("access_token");
    expect(localStorage.getItem("refresh")).toBe("refresh_token");
    expect(JSON.parse(localStorage.getItem("user")).name).toBe("Test");
  });

  it("should clear user on logout", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    act(() => {
      screen.getByText("Login").click();
    });
    act(() => {
      screen.getByText("Logout").click();
    });

    expect(screen.getByTestId("user").textContent).toBe("no user");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("false");
  });

  it("should clear localStorage on logout", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    act(() => {
      screen.getByText("Login").click();
    });
    act(() => {
      screen.getByText("Logout").click();
    });

    expect(localStorage.getItem("access")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("should rehydrate from localStorage on mount", () => {
    // Pre-populate localStorage as if user was already logged in
    localStorage.setItem(
      "user",
      JSON.stringify({ name: "Stored User", role: "user" }),
    );
    localStorage.setItem("access", "stored_token");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("user").textContent).toBe("Stored User");
    expect(screen.getByTestId("isAuthenticated").textContent).toBe("true");
  });
});
