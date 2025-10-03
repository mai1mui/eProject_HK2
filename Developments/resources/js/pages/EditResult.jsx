import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "./Sidebar";
import "../../css/ResultManagement.css";

const API_BASE = "http://127.0.0.1:8000/api";

export default function EditResult() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        LearnerName: "",
        CourseID: "",
        ExamName: "",
        Score: "",
        RStatus: "Pending",
    });

    useEffect(() => {
        fetchResult();
    }, []);

    const fetchResult = async () => {
        try {
            const res = await axios.get(`${API_BASE}/results/${id}`);
            setForm(res.data);
        } catch (err) {
            console.error("Error fetching result:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_BASE}/results/${id}`, form);
            alert("Result updated successfully!");
            navigate("/admin/results");
        } catch (err) {
            console.error("Error updating result:", err);
        }
    };

    return (
        <div className="admin-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <h2 className="logo">Admin Panel</h2>
                <Sidebar />
            </aside>

            {/* Content */}
            <main className="content">
                <div className="form-wrapper">
                    <h2 className="page-title text-center">Edit Result</h2>

                    <form className="edit-form" onSubmit={handleSubmit}>
                        {/* Learner Name */}
                        <div className="form-group">
                            <label>Learner Name</label>
                            <input
                                type="text"
                                name="LearnerName"
                                value={form.LearnerName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Course */}
                        <div className="form-group">
                            <label>Course</label>
                            <input
                                type="text"
                                name="CourseID"
                                value={form.CourseID}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Exam */}
                        <div className="form-group">
                            <label>Exam</label>
                            <input
                                type="text"
                                name="ExamName"
                                value={form.ExamName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Score */}
                        <div className="form-group">
                            <label>Score</label>
                            <input
                                type="number"
                                name="Score"
                                value={form.Score}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Status */}
                        <div className="form-group">
                            <label>Status</label>
                            <select
                                name="RStatus"
                                value={form.RStatus}
                                onChange={handleChange}
                            >
                                <option value="Passed">Passed</option>
                                <option value="Failed">Failed</option>
                                <option value="Pending">Pending</option>
                            </select>
                        </div>

                        {/* Buttons */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn-cancel"
                                onClick={() => navigate("/admin/results")}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn-save">
                                Save changes
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}
