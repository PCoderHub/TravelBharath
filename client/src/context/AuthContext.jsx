import { createContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem("access") || null;
  });

  const login = (userData, tokens) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("access", tokens.access);
    localStorage.setItem("refresh", tokens.refresh);
    setUser(userData);
    setAccessToken(tokens.access);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAccessToken(null);
  };

  const isAuthenticated = !!user && !!accessToken;
  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{ user, accessToken, isAuthenticated, isAdmin, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
