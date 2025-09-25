import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../../css/FeedbackManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function FeedbackDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [feedback, setFeedback] = useState(null);
  const [reply, setReply] = useState("");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      const res = await axios.get(`${API_BASE}/feedback/${id}`);
      setFeedback(res.data);
    } catch (err) {
      console.error("Error fetching feedback detail:", err);
    }
  };

  const handleReply = async () => {
    if (!reply.trim()) {
      alert("Please enter your reply.");
      return;
    }
    try {
      await axios.put(`${API_BASE}/feedback/${id}`, {
        AdminReply: reply,
        FStatus: "Processed",
      });
      alert("Reply sent successfully!");
      navigate("/admin/feedback");
    } catch (err) {
      console.error("Error sending reply:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`${API_BASE}/feedback/${id}`);
      alert("Feedback deleted.");
      navigate("/admin/feedback");
    } catch (err) {
      console.error("Error deleting feedback:", err);
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

  if (!feedback) return <p className="loading">Loading feedback detail...</p>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="content">
        <div className="detail-card">
          <div className="detail-header">
            <h2>Feedback details</h2>
            <Link to="/admin/feedback" className="btn-back">
              ← Come back
            </Link>
          </div>

          <div className="detail-body">
            <p><strong>FeedbackID</strong><br />{feedback.FeedbackID}</p>
            <p><strong>User</strong><br />{feedback.AccountID}</p>
            <p><strong>Rate</strong><br />{renderStars(feedback.Rate)}</p>

            <p><strong>Content</strong><br />
              <div className="content-box">{feedback.Content}</div>
            </p>

            {/* Hiển thị AdminReply nếu đã có */}
            {feedback.AdminReply && (
              <p><strong>Admin Reply</strong><br />
                <div className="reply-box">{feedback.AdminReply}</div>
              </p>
            )}

            <p><strong>Response date</strong><br />{feedback.CreatedAt}</p>
            <p><strong>Status</strong><br />
              <span
                className={
                  feedback.FStatus === "Processed"
                    ? "status-processed"
                    : "status-waiting"
                }
              >
                {feedback.FStatus}
              </span>
            </p>
          </div>

          <hr className="divider" />

          <div className="admin-action">
            <h3>Admin Action</h3>
            <label>Reply to feedback</label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="Enter your answer here..."
            ></textarea>
            <div className="action-buttons">
              <button className="btn-save" onClick={handleReply}>
                <i className="fas fa-paper-plane"></i> Send reply
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                <i className="fas fa-trash"></i> Delete feedback
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
