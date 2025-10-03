import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../css/Sidebar.css";

export default function Sidebar() {
  const location = useLocation();

  // Hàm check active link
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <aside className="sidebar">
      <div className="logo">
        <i className="fas fa-user-shield"></i>
        <Link to="/admin/dashboard">
        <span>Admin Panel</span>
        </Link>
        
      </div>
      <nav>
        <ul>
          <li className={isActive("/admin/users") ? "active" : ""}>
            <Link to="/admin/users">
              <i className="fas fa-user"></i>
              <span>Account Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/courses") ? "active" : ""}>
            <Link to="/admin/courses">
              <i className="fas fa-book"></i>
              <span>Course Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/lessons") ? "active" : ""}>
            <Link to="/admin/lessons">
              <i className="fas fa-chalkboard-teacher"></i>
              <span>Lessons Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/enrollments") ? "active" : ""}>
            <Link to="/admin/enrollments">
              <i className="fas fa-clipboard-list"></i>
              <span>Enrollments Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/submissions") ? "active" : ""}>
            <Link to="/admin/submissions">
              <i className="fas fa-folder-open"></i>
              <span>Submissions Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/results") ? "active" : ""}>
            <Link to="/admin/results">
              <i className="fas fa-check-square"></i>
              <span>Results Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/feedback") ? "active" : ""}>
            <Link to="/admin/feedback">
              <i className="fas fa-comments"></i>
              <span>Feedback Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/payments") ? "active" : ""}>
            <Link to="/admin/payments">
              <i className="fas fa-credit-card"></i>
              <span>Payments Management</span>
            </Link>
          </li>
          <li className={isActive("/admin/reports") ? "active" : ""}>
            <Link to="/admin/reports">
              <i className="fas fa-chart-bar"></i>
              <span>Reports Management</span>
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
