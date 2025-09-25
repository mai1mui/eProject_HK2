import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../../css/ResultManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function ResultManagement() {
  const [results, setResults] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterExam, setFilterExam] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await axios.get(`${API_BASE}/results`);
      setResults(res.data);
    } catch (err) {
      console.error("Error fetching results:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this result?")) return;
    try {
      await axios.delete(`${API_BASE}/results/${id}`);
      setResults((prev) => prev.filter((r) => r.ResultID !== id));
    } catch (err) {
      console.error("Error deleting result:", err);
    }
  };

  const filteredResults = results.filter((r) => {
    return (
      (search === "" ||
        r.LearnerName.toLowerCase().includes(search.toLowerCase()) ||
        r.CourseID.toLowerCase().includes(search.toLowerCase()) ||
        r.ExamName.toLowerCase().includes(search.toLowerCase())) &&
      (filterCourse === "" || r.CourseID === filterCourse) &&
      (filterExam === "" || r.ExamName === filterExam) &&
      (filterStatus === "" || r.RStatus === filterStatus)
    );
  });

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <Sidebar />
      </aside>
        {/* Main content */}
      <main className="content">
        <h2 className="title">Admin • Result Management</h2>

        {/* Search + Filters */}
        <div className="filters">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={filterCourse} onChange={(e) => setFilterCourse(e.target.value)}>
            <option value="">-- Filter by Course --</option>
            <option value="Demo 01">Demo 01</option>
            <option value="Demo 02">Demo 02</option>
            <option value="Demo 03">Demo 03</option>
          </select>
          <select value={filterExam} onChange={(e) => setFilterExam(e.target.value)}>
            <option value="">-- Filter by Exam --</option>
            <option value="Midterm">Midterm</option>
            <option value="Final Exam">Final Exam</option>
            <option value="Quiz">Quiz</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">-- Filter by Status --</option>
            <option value="Passed">Passed</option>
            <option value="Failed">Failed</option>
            <option value="Pending">Pending</option>
          </select>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="result-table">
            <thead>
              <tr>
                <th>Learner name</th>
                <th>Course</th>
                <th>Exam</th>
                <th>Score</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((r) => (
                <tr key={r.ResultID}>
                  <td>{r.LearnerName}</td>
                  <td>{r.CourseID}</td>
                  <td>{r.ExamName}</td>
                  <td>{r.Score}</td>
                  <td
                    className={
                      r.RStatus === "Passed"
                        ? "status-passed"
                        : r.RStatus === "Failed"
                        ? "status-failed"
                        : "status-pending"
                    }
                  >
                    {r.RStatus}
                  </td>
                  <td className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/results/edit/${r.ResultID}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(r.ResultID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredResults.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center">
                    No results found.
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
