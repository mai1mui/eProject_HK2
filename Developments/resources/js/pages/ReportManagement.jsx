import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import "../../css/ReportManagement.css";

export default function ReportManagement() {
  const [reports, setReports] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stats, setStats] = useState({ users: 0, courses: 0, revenue: 0, complete: 0 });

  const fetchReports = async (from = "", to = "") => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/reports", {
        params: { from, to },
      });
      setReports(res.data.new_users || []);
      setStats(res.data.stats || {});
    } catch (err) {
      console.error("Error fetching reports:", err);
    }
  };

  const applyFilter = () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    fetchReports(startDate, endDate);
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="admin-container">
      <Sidebar />
      <main className="content">
        {/* Header */}
          <h1 className="title">Admin Dashboard Reports</h1>
          <div className="filter">
            <label>
              From:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              To:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
            <button onClick={applyFilter}>Apply</button>
          </div>
        {/* Stats */}
        <section className="stats">
          <div className="card">
            <p>👥 Users</p>
            <h2>{stats.users}</h2>
          </div>
          <div className="card">
            <p>📚 Courses</p>
            <h2>{stats.courses}</h2>
          </div>
          <div className="card">
            <p>💰 Revenue</p>
            <h2>{stats.revenue} VND</h2>
          </div>
          <div className="card">
            <p>⏳ Completion</p>
            <h2>{stats.complete}%</h2>
          </div>
        </section>

        {/* Table */}
        <div className="table-wrapper">
          <h3>New Users</h3>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Registration Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((u, idx) => (
                <tr key={idx}>
                  <td>{u.name}</td>
                  <td>{u.role}</td>
                  <td>{u.created_at}</td>
                  <td>{u.status}</td>
                </tr>
              ))}
              {reports.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    No data found.
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
