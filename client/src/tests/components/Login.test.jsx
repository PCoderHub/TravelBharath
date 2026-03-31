// src/tests/components/Login.test.jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router";
import Login from "../../pages/Auth/Login";
import * as useAuthModule from "../../hooks/useAuth";
import * as userServices from "../../services/userServices";

// Mock modules
vi.mock("../../services/userServices");
vi.mock("../../hooks/useError", () => ({
  useError: () => ({
    notifyPromise: (promise) => promise, // just resolve the promise directly
  }),
}));

const mockUseAuth = (overrides = {}) => {
  vi.spyOn(useAuthModule, "useAuth").mockReturnValue({
    isAuthenticated: false,
    isAdmin: false,
    login: vi.fn(),
    ...overrides,
  });
};

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>,
  );
};

describe("Login", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth();
  });

  // ─── Rendering ───────────────────────────────────

  it("should render email and password inputs", () => {
    renderLogin();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(
      document.querySelector("input[type='password']"),
    ).toBeInTheDocument();
  });

  it("should render login button", () => {
    renderLogin();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("should redirect to dashboard if already authenticated as admin", () => {
    mockUseAuth({ isAuthenticated: true, isAdmin: true });

    render(
      <MemoryRouter initialEntries={["/admin"]}>
        <Login />
      </MemoryRouter>,
    );

    // Navigate component renders — login form should not be visible
    expect(
      screen.queryByRole("button", { name: /login/i }),
    ).not.toBeInTheDocument();
  });

  // ─── Validation ──────────────────────────────────

  it("should show error if email is empty on submit", async () => {
    renderLogin();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Email is required")).toBeInTheDocument();
  });

  it("should show error if password is empty on submit", async () => {
    renderLogin();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Password is required")).toBeInTheDocument();
  });

  //   it("should show error for invalid email format", async () => {
  //     renderLogin()
  //     const user = userEvent.setup()

  //     await user.type(screen.getByRole("textbox", { name: /email/i }), "notanemail")
  //     await user.click(screen.getByRole("button", { name: /login/i }))

  //     expect(await screen.findByText("Invalid email address")).toBeInTheDocument()
  //   })

  // ─── Submission ──────────────────────────────────

  it("should call userLogin with correct credentials", async () => {
    const mockLogin = vi.fn();
    mockUseAuth({ login: mockLogin });

    userServices.userLogin.mockResolvedValue({
      user: { name: "Test", role: "admin" },
      access: "access_token",
      refresh: "refresh_token",
    });

    renderLogin();
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@test.com",
    );
    await user.type(
      document.querySelector("input[type='password']"),
      "Test@1234",
    );
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(userServices.userLogin).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "Test@1234",
      });
    });
  });

  it("should call login context function on success", async () => {
    const mockLogin = vi.fn();
    mockUseAuth({ login: mockLogin });

    const mockUser = { name: "Test", role: "admin" };
    userServices.userLogin.mockResolvedValue({
      user: mockUser,
      access: "access_token",
      refresh: "refresh_token",
    });

    renderLogin();
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@test.com",
    );
    await user.type(
      document.querySelector("input[type='password']"),
      "Test@1234",
    );
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(mockUser, {
        access: "access_token",
        refresh: "refresh_token",
      });
    });
  });

  it("should disable button while submitting", async () => {
    // Make userLogin hang so we can check loading state
    userServices.userLogin.mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    renderLogin();
    const user = userEvent.setup();

    await user.type(
      screen.getByRole("textbox", { name: /email/i }),
      "test@test.com",
    );
    await user.type(
      document.querySelector("input[type='password']"),
      "Test@1234",
    );
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByRole("button")).toBeDisabled();
  });
});
