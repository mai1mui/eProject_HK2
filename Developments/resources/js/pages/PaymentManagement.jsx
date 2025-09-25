import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../../css/PaymentManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLearner, setFilterLearner] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payments`);
      setPayments(res.data);
    } catch (err) {
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this payment?")) return;
    try {
      await axios.delete(`${API_BASE}/payments/${id}`);
      setPayments((prev) => prev.filter((p) => p.PaymentID !== id));
    } catch (err) {
      console.error("Error deleting payment:", err);
    }
  };

  const filteredPayments = payments.filter((p) => {
    return (
      (search === "" ||
        p.PaymentID.toLowerCase().includes(search.toLowerCase()) ||
        p.AccountID.toLowerCase().includes(search.toLowerCase()) ||
        p.CourseID.toLowerCase().includes(search.toLowerCase())) &&
      (filterLearner === "" || p.AccountID === filterLearner) &&
      (filterCourse === "" || p.CourseID === filterCourse) &&
      (filterStatus === "" || p.PStatus === filterStatus)
    );
  });

  if (loading) return <p className="loading">Loading payments...</p>;

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <Sidebar />
      </aside>

      {/* Main content */}
      <main className="content">
        <h2 className="title">Admin • Payment Management</h2>

        {/* Search */}
        <div className="toolbar">
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={filterLearner}
            onChange={(e) => setFilterLearner(e.target.value)}
          >
            <option value="">-- Filter by Learner --</option>
            <option value="ACC001">Nguyen Van A</option>
            <option value="ACC002">Nguyen Van B</option>
            <option value="ACC003">Nguyen Van C</option>
          </select>
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
          >
            <option value="">-- Filter by Course --</option>
            <option value="C001">Demo 01</option>
            <option value="C002">Demo 02</option>
            <option value="C003">Demo 03</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">-- Filter by Status --</option>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Not confirmed">Not confirmed</option>
          </select>
        </div>

        {/* Actions */}
        <div className="actions">
          <button
            className="btn-add"
            onClick={() => navigate("/admin/payments/add")}
          >
            <i className="fas fa-plus"></i> Add new payment
          </button>

        </div>

        {/* Table */}
        <div className="table-wrapper">
          <table className="payment-table">
            <thead>
              <tr>
                <th>PaymentID</th>
                <th>Learner</th>
                <th>Course</th>
                <th>Amount</th>
                <th>Payment Date</th>
                <th>Status</th>
                <th>Transaction Ref</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map((p) => (
                <tr key={p.PaymentID}>
                  <td>{p.PaymentID}</td>
                  <td>{p.AccountID}</td>
                  <td>{p.CourseID}</td>
                  <td>{p.Amount} đ</td>
                  <td>{p.PDate}</td>
                  <td>
                    <span
                      className={
                        p.PStatus === "Paid"
                          ? "status-paid"
                          : p.PStatus === "Processing"
                          ? "status-processing"
                          : "status-not"
                      }
                    >
                      {p.PStatus}
                    </span>
                  </td>
                  <td>{p.TransactionRef}</td>
                  <td className="action-buttons">
                    <button
                      className="btn-edit"
                      onClick={() => navigate(`/admin/payments/edit/${p.PaymentID}`)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn-delete"
                      onClick={() => handleDelete(p.PaymentID)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {filteredPayments.length === 0 && (
                <tr>
                  <td colSpan="8" className="text-center">
                    No payments found.
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
