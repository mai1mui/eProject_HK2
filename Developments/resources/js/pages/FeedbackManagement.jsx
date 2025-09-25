import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../../css/FeedbackManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterUser, setFilterUser] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, [search, filterUser, filterRating, filterStatus]);

  const fetchFeedbacks = async () => {
    try {
      const res = await axios.get(`${API_BASE}/feedback`);
      let data = res.data;

      // search & filters
      if (search) {
        data = data.filter(
          (f) =>
            f.Content.toLowerCase().includes(search.toLowerCase()) ||
            f.AccountID.toLowerCase().includes(search.toLowerCase())
        );
      }
      if (filterUser) {
        data = data.filter((f) => f.AccountID === filterUser);
      }
      if (filterRating) {
        data = data.filter((f) => f.Rate == filterRating);
      }
      if (filterStatus) {
        data = data.filter((f) => f.FStatus === filterStatus);
      }

      setFeedbacks(data);
    } catch (err) {
      console.error("Error loading feedback:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rate) => {
    return (
      <span className="stars">
        {Array.from({ length: 5 }, (_, i) => (
          <i
            key={i}
            className={`fa-star ${i < rate ? "fas star-filled" : "far star-empty"}`}
          ></i>
        ))}
      </span>
    );
  };

  if (loading) return <p className="loading">Loading feedback...</p>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="content">
        <h2 className="title">Admin • Feedback Management</h2>

        {/* Search + Filters */}
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search feedback..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
            <option value="">-- Filter by User --</option>
            <option value="Learner01">Learner01</option>
            <option value="Guest01">Guest01</option>
            <option value="Guest02">Guest02</option>
          </select>

          <select value={filterRating} onChange={(e) => setFilterRating(e.target.value)}>
            <option value="">-- Filter by Rating --</option>
            <option value="5">★★★★★</option>
            <option value="4">★★★★</option>
            <option value="3">★★★</option>
            <option value="2">★★</option>
            <option value="1">★</option>
          </select>

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">-- Filter by Status --</option>
            <option value="Processed">Processed</option>
            <option value="Waiting">Waiting</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="feedback-table">
            <thead>
              <tr>
                <th>FeedbackID</th>
                <th>User</th>
                <th>Rate</th>
                <th>Content</th>
                <th>Response Date</th>
                <th>Status</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f.FeedbackID}>
                  <td>{f.FeedbackID}</td>
                  <td>{f.AccountID}</td>
                  <td>{renderStars(f.Rate)}</td>
                  <td className="truncate">{f.Content}</td>
                  <td>{f.CreatedAt}</td>
                  <td>
                    <span
                      className={
                        f.FStatus === "Processed"
                          ? "status-processed"
                          : "status-waiting"
                      }
                    >
                      {f.FStatus}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/admin/feedback/${f.FeedbackID}`)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {feedbacks.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center">
                    No feedback found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Back */}
        <div className="back-dashboard">
          <Link to="/admin" className="btn-back">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
}
