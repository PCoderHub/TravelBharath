import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/admin",
    Component: Login,
  },
  {
    path: "/admin/dashboard",
    element: (
      <ProtectedRoute requireAdmin>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
]);
