import React, { useEffect, useState } from "react";
import "../../css/EnrollmentManagement.css";
import Sidebar from "./Sidebar";
import NewEnrollment from "./NewEnrollment";

const API_BASE = "http://127.0.0.1:8000/api";

export default function EnrollmentManagement() {
  const [enrollments, setEnrollments] = useState([]);
  const [learners, setLearners] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterLearner, setFilterLearner] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [formData, setFormData] = useState({
    AccountID: "",
    CourseID: "",
    EnrollDate: "",
    EStatus: "Processing",
  });

  // Load learners + courses
  useEffect(() => {
    fetch(`${API_BASE}/users`)
      .then((res) => res.json())
      .then((data) => setLearners(data))
      .catch((err) => console.error("Error loading learners:", err));

    fetch(`${API_BASE}/courses`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error loading courses:", err));
  }, []);

  // Load enrollments
  useEffect(() => {
    loadEnrollments();
  }, [search, filterLearner, filterCourse, filterStatus]);

  const loadEnrollments = () => {
    let query = new URLSearchParams();
    if (search) query.append("search", search);
    if (filterLearner) query.append("learner", filterLearner);
    if (filterCourse) query.append("course", filterCourse);
    if (filterStatus) query.append("status", filterStatus);

    fetch(`${API_BASE}/enrollments?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setEnrollments(data))
      .catch((err) => console.error("Error loading enrollments:", err));
  };

  // Submit Add/Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingEnrollment ? "PUT" : "POST";
    const url = editingEnrollment
      ? `${API_BASE}/enrollments/${editingEnrollment.EnrollmentID}`
      : `${API_BASE}/enrollments`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setShowForm(false);
        setEditingEnrollment(null);
        loadEnrollments();
      })
      .catch((err) => console.error("Error saving enrollment:", err));
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this enrollment?")) {
      fetch(`${API_BASE}/enrollments/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => loadEnrollments())
        .catch((err) => console.error("Error deleting enrollment:", err));
    }
  };

  const openAddForm = () => {
    setFormData({
      AccountID: "",
      CourseID: "",
      EnrollDate: "",
      EStatus: "Processing",
    });
    setEditingEnrollment(null);
    setShowForm(true);
  };

  const openEditForm = (enr) => {
    setFormData({
      AccountID: enr.AccountID,
      CourseID: enr.CourseID,
      EnrollDate: enr.EnrollDate,
      EStatus: enr.EStatus,
    });
    setEditingEnrollment(enr);
    setShowForm(true);
  };

  return (
    <div className="layout-container">
      <Sidebar />
      <main className="content">
        <div className="card-container">
          <h2 className="title">Admin • Enrollment Management</h2>

          {/* Search & Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search enrollments..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              value={filterLearner}
              onChange={(e) => setFilterLearner(e.target.value)}
            >
              <option value="">-- Filter by Learner --</option>
              {learners.map((u) => (
                <option key={u.AccountID} value={u.AccountID}>
                  {u.AName}
                </option>
              ))}
            </select>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="">-- Filter by Course --</option>
              {courses.map((c) => (
                <option key={c.CourseID} value={c.CourseID}>
                  {c.CName}
                </option>
              ))}
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
            <button className="btn btn-add" onClick={openAddForm}>
              + Add new enrollment
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>EnrollmentID</th>
                  <th>Learner</th>
                  <th>Course</th>
                  <th>Registration date</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.length > 0 ? (
                  enrollments.map((enr) => (
                    <tr key={enr.EnrollmentID}>
                      <td>#{enr.EnrollmentID}</td>
                      <td>{enr.LearnerName}</td>
                      <td>{enr.CourseName}</td>
                      <td>{enr.EnrollDate}</td>
                      <td
                        className={
                          enr.EStatus === "Paid"
                            ? "status-green"
                            : enr.EStatus === "Processing"
                            ? "status-yellow"
                            : "status-red"
                        }
                      >
                        {enr.EStatus}
                      </td>
                      <td>
                        <button
                          className="btn btn-edit"
                          onClick={() => openEditForm(enr)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(enr.EnrollmentID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-data">
                      No enrollments found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Add/Edit */}
        {showForm && (
          <NewEnrollment
            learners={learners}
            courses={courses}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleClose={() => setShowForm(false)}
            editingEnrollment={editingEnrollment}
          />
        )}
      </main>
    </div>
  );
}
