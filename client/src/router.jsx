import { createBrowserRouter } from "react-router";
import Landing from "./pages/Landing/Landing";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Landing,
  },
  {
    path: "/admin",
    Component: Login,
    children: [
      {
        path: "/dashboard",
        Component: Dashboard,
      },
    ],
  },
]);
