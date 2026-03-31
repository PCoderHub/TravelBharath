import React from "react";
import { useNavigate } from "react-router";
import { logoutUser } from "../../services/userServices";
import { useAuth } from "../../hooks/useAuth.js";

function Dashboard() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const handleLogout = async () => {
    try {
      await logoutUser(); // send it to backend to invalidate
    } catch (err) {
      console.error(err);
    } finally {
      logout();
      navigate("/admin");
    }
  };

  return (
    <div>
      <h1>Welcome {user?.name}</h1>
      <button
        onClick={handleLogout}
        className="bg-yellow-500 hover:bg-yellow-600 hover:scale-105 text-white lg:text-2xl font-bold py-2 px-4 lg:py-4 lg:px-8 rounded-full"
      >
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
