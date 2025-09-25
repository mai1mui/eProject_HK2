import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../../css/SubmissionManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function EditSubmission() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    AccountID: "",
    CourseID: "",
    Answer: "",
    Mark: "",
    Feedback: "",
    SStatus: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSubmission();
  }, [id]);

  const fetchSubmission = async () => {
    try {
      const res = await axios.get(`${API_BASE}/submissions/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching submission:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/submissions/${id}`, form);
      setMessage("Submission updated successfully!");
      setTimeout(() => navigate("/admin/submissions"), 1500);
    } catch (err) {
      console.error("Error updating submission:", err);
      setMessage("Update failed!");
    }
  };

  if (loading) return <p className="loading">Loading submission...</p>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <Sidebar />
      </aside>

      {/* Main Content */}
      <main className="content">
        <h2 className="page-title">Edit Submission • {id}</h2>

        {message && <p className="message">{message}</p>}

        <form className="edit-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Learner (AccountID)</label>
            <input
              type="text"
              name="AccountID"
              value={form.AccountID}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>CourseID</label>
            <input
              type="text"
              name="CourseID"
              value={form.CourseID}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Answer</label>
            <input
              type="text"
              name="Answer"
              value={form.Answer || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mark</label>
            <input
              type="number"
              name="Mark"
              value={form.Mark || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Feedback</label>
            <textarea
              name="Feedback"
              value={form.Feedback || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select
              name="SStatus"
              value={form.SStatus}
              onChange={handleChange}
              required
            >
              <option value="Submitted">Submitted</option>
              <option value="Late">Late</option>
              <option value="Not Submit">Not Submit</option>
            </select>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <Link to="/admin/submissions" className="btn-cancel">Cancel</Link>
          </div>
        </form>
      </main>
    </div>
  );
}
