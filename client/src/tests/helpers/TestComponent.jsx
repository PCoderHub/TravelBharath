import { useAuth } from "../../hooks/useAuth";

const TestComponent = () => {
  const { user, isAuthenticated, isAdmin, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="user">{user?.name || "no user"}</span>
      <span data-testid="isAuthenticated">{isAuthenticated.toString()}</span>
      <span data-testid="isAdmin">{isAdmin.toString()}</span>
      <button
        onClick={() =>
          login(
            { name: "Test", role: "admin" },
            { access: "access_token", refresh: "refresh_token" },
          )
        }
      >
        Login
      </button>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default TestComponent;
