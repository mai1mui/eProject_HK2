import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../css/CourseManagement.css";
import NewCourse from "./NewCourse";
import Sidebar from "./Sidebar"; 

const API_BASE = "http://127.0.0.1:8000/api";

export default function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [creators, setCreators] = useState([]);
  const [search, setSearch] = useState("");
  const [creator, setCreator] = useState("");
  const [status, setStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    CName: "",
    CDescription: "",
    StartDate: "",
    CreatorID: "",
    CStatus: "active",
  });

  // Load creators
  useEffect(() => {
    fetch(`${API_BASE}/creators`)
      .then((res) => res.json())
      .then((data) => setCreators(data))
      .catch((err) => console.error("Error loading creators:", err));
  }, []);

  // Load courses
  useEffect(() => {
    loadCourses();
  }, [search, creator, status]);

  const loadCourses = () => {
    let query = new URLSearchParams();
    if (search) query.append("search", search);
    if (creator) query.append("creator", creator);
    if (status) query.append("status", status);

    fetch(`${API_BASE}/courses?${query.toString()}`)
      .then((res) => res.json())
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error loading courses:", err));
  };

  // Submit form (Add/Edit)
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingCourse ? "PUT" : "POST";
    const url = editingCourse
      ? `${API_BASE}/courses/${editingCourse.CourseID}`
      : `${API_BASE}/courses`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then(() => {
        setShowForm(false);
        setEditingCourse(null);
        loadCourses();
      });
  };

  // Delete
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      fetch(`${API_BASE}/courses/${id}`, { method: "DELETE" })
        .then((res) => res.json())
        .then(() => loadCourses());
    }
  };

  // Open Add form
  const openAddForm = () => {
    setFormData({
      CName: "",
      CDescription: "",
      StartDate: "",
      CreatorID: "",
      CStatus: "active",
    });
    setEditingCourse(null);
    setShowForm(true);
  };

  // Open Edit form
  const openEditForm = (course) => {
    setFormData({
      CName: course.CName,
      CDescription: course.CDescription,
      StartDate: course.StartDate,
      CreatorID: course.CreatorID,
      CStatus: course.CStatus,
    });
    setEditingCourse(course);
    setShowForm(true);
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
            <Sidebar />

      {/* Main Content */}
      <main className="content">
        <div className="card-container">
          <h2 className="title">Admin • Course Management</h2>

          {/* Search & Filter */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search course..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select value={creator} onChange={(e) => setCreator(e.target.value)}>
              <option value="">-- Filter by Creator --</option>
              {creators.map((c) => (
                <option key={c.AccountID} value={c.AccountID}>
                  {c.AName}
                </option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">-- Filter by Status --</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn btn-add" onClick={openAddForm}>
              + Add new course
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>CourseID</th>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>Creator</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <tr key={course.CourseID}>
                      <td>{course.CourseID}</td>
                      <td>{course.CName}</td>
                      <td>{course.CDescription}</td>
                      <td>{course.StartDate}</td>
                      <td>{course.CreatorID}</td>
                      <td>{course.CStatus}</td>
                      <td>
                        <button
                          className="btn btn-edit"
                          onClick={() => openEditForm(course)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(course.CourseID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-data">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Add/Edit */}
        {showForm && (
          <NewCourse
            creators={creators}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleClose={() => setShowForm(false)}
            editingCourse={editingCourse}
          />
        )}
      </main>
    </div>
  );
}
