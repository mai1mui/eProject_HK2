import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar"; // dùng lại Sidebar component
import "../../css/SubmissionManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function SubmissionManagement() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [course, setCourse] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadSubmissions();
  }, [search, status, course]);

  const loadSubmissions = async () => {
    try {
      let query = new URLSearchParams();
      if (search) query.append("search", search);
      if (status) query.append("status", status);
      if (course) query.append("course", course);

      const res = await axios.get(`${API_BASE}/submissions?${query.toString()}`);
      setSubmissions(res.data);
    } catch (err) {
      console.error("Error loading submissions:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?")) return;
    try {
      await axios.delete(`${API_BASE}/submissions/${id}`);
      setSubmissions(submissions.filter((s) => s.SubID !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <p className="loading">Loading submissions...</p>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="content">
        <h2 className="title">Admin • Submission Management</h2>

        {/* Search + Filters */}
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search submissions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select value={course} onChange={(e) => setCourse(e.target.value)}>
            <option value="">-- Filter by Course --</option>
            <option value="C001">Demo 01</option>
            <option value="C002">Demo 02</option>
            <option value="C003">Demo 03</option>
          </select>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">-- Filter by Status --</option>
            <option value="Submitted">Submitted</option>
            <option value="Late">Late</option>
            <option value="Not Submit">Not Submit</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="submission-table">
            <thead>
              <tr>
                <th>SubmissionID</th>
                <th>Learner</th>
                <th>Course</th>
                <th>Answer</th>
                <th>Mark</th>
                <th>Feedback</th>
                <th>Date Submitted</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((s) => (
                <tr key={s.SubID}>
                  <td>{s.SubID}</td>
                  <td>{s.learner_name || s.AccountID}</td>
                  <td>{s.course_name || s.CourseID}</td>
                  <td>{s.Answer}</td>
                  <td>{s.Mark}</td>
                  <td>{s.Feedback}</td>
                  <td>{s.SDate}</td>
                  <td>
                    <span
                      className={
                        s.SStatus === "Submitted"
                          ? "status-submitted"
                          : s.SStatus === "Late"
                          ? "status-late"
                          : "status-not"
                      }
                    >
                      {s.SStatus}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() =>
                        navigate(`/admin/submissions/edit/${s.SubID}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(s.SubID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="9" className="text-center">
                    No submissions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
