import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../../css/PaymentManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function EditPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetchPayment();
  }, []);

  const fetchPayment = async () => {
    try {
      const res = await axios.get(`${API_BASE}/payments/${id}`);
      setForm(res.data);
    } catch (err) {
      console.error("Error fetching payment:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/payments/${id}`, form);
      alert("Payment updated successfully!");
      navigate("/admin/payments");
    } catch (err) {
      console.error("Error updating payment:", err);
    }
  };

  if (!form) return <p className="loading">Loading payment...</p>;

  return (
    <div className="admin-container">
      <aside className="sidebar">
        <h2 className="logo">Admin Panel</h2>
        <Sidebar />
      </aside>

      <main className="content">
        <h2 className="page-title">Edit Payment {id}</h2>
        <form className="edit-form" onSubmit={handleSubmit}>
          <input type="text" name="PaymentID" value={form.PaymentID} readOnly />
          <input type="text" name="AccountID" value={form.AccountID} onChange={handleChange} required />
          <input type="text" name="CourseID" value={form.CourseID} onChange={handleChange} required />
          <input type="number" name="Amount" value={form.Amount} onChange={handleChange} required />
          <input type="date" name="PDate" value={form.PDate} onChange={handleChange} required />
          <select name="PStatus" value={form.PStatus} onChange={handleChange}>
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Not confirmed">Not confirmed</option>
          </select>
          <input type="text" name="TransactionRef" value={form.TransactionRef} onChange={handleChange} required />

          <div className="form-actions">
            <button type="submit" className="btn-save">Update</button>
            <button type="button" className="btn-cancel" onClick={() => navigate("/admin/payments")}>Cancel</button>
          </div>
        </form>
      </main>
    </div>
  );
}
