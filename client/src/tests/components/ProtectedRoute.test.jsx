// src/tests/components/ProtectedRoute.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router";
import ProtectedRoute from "../../components/ProtectedRoute";
import * as useAuthModule from "../../hooks/useAuth";

// Helper to render with routing
const renderWithRouter = (ui, { initialEntries = ["/"] } = {}) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>,
  );
};

describe("ProtectedRoute", () => {
  it("should render children if authenticated", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
    });

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<div>Login Page</div>} />
      </Routes>,
    );

    expect(screen.getByText("Protected Content")).toBeInTheDocument();
  });

  it("should redirect to /admin if not authenticated", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
    });

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <div>Protected Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<div>Login Page</div>} />
      </Routes>,
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("should redirect if authenticated but not admin when requireAdmin", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthenticated: true,
      isAdmin: false,
    });

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute requireAdmin>
              <div>Admin Content</div>
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<div>Unauthorized</div>} />
      </Routes>,
    );

    expect(screen.queryByText("Admin Content")).not.toBeInTheDocument();
    expect(screen.getByText("Unauthorized")).toBeInTheDocument();
  });

  it("should render children if authenticated and isAdmin with requireAdmin", () => {
    vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
    });

    renderWithRouter(
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute requireAdmin>
              <div>Admin Content</div>
            </ProtectedRoute>
          }
        />
      </Routes>,
    );

    expect(screen.getByText("Admin Content")).toBeInTheDocument();
  });
});
