import React from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/logout",
        {},
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <nav className="topbar">
      <Link to="/">Home</Link>
      <Link to="/admin/courses">Courses</Link>
      <button onClick={handleLogout} className="btn-ghost">
        Logout
      </button>
    </nav>
  );
}
