import React, { useEffect, useState } from "react";
import "../../css/LessonManagement.css";
import Sidebar from "./Sidebar";
import NewLesson from "./NewLesson";

const API_BASE = "http://127.0.0.1:8000/api";

export default function LessonManagement() {
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    CourseID: "",
    LName: "",
    Content: "",
    LessonType: "",
    Ordinal: "",
    LStatus: "Approved",
  });

  // Load courses for dropdown
  useEffect(() => {
    fetch(`${API_BASE}/courses`)
      .then((res) => {
        if (!res.ok) throw new Error("API error " + res.status);
        return res.json();
      })
      .then((data) => setCourses(data))
      .catch((err) => console.error("Error loading courses:", err));
  }, []);

  // Load lessons
  useEffect(() => {
    loadLessons();
  }, [search, filterCourse, filterType, filterStatus]);

  const loadLessons = () => {
    let query = new URLSearchParams();
    if (search) query.append("search", search);
    if (filterCourse) query.append("course", filterCourse);
    if (filterType) query.append("type", filterType);
    if (filterStatus) query.append("status", filterStatus);

    fetch(`${API_BASE}/lessons?${query.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("API error " + res.status);
        return res.json();
      })
      .then((data) => setLessons(data))
      .catch((err) => console.error("Error loading lessons:", err));
  };

  // Submit Add/Edit
  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingLesson ? "PUT" : "POST";
    const url = editingLesson
      ? `${API_BASE}/lessons/${editingLesson.LessonID}`
      : `${API_BASE}/lessons`;

    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("API error " + res.status);
        return res.json();
      })
      .then(() => {
        setShowForm(false);
        setEditingLesson(null);
        loadLessons();
      })
      .catch((err) => console.error("Error saving lesson:", err));
  };

  // Delete lesson
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this lesson?")) {
      fetch(`${API_BASE}/lessons/${id}`, { method: "DELETE" })
        .then((res) => {
          if (!res.ok) throw new Error("API error " + res.status);
          return res.json();
        })
        .then(() => loadLessons())
        .catch((err) => console.error("Error deleting lesson:", err));
    }
  };

  // Open Add form
  const openAddForm = () => {
    setFormData({
      CourseID: "",
      LName: "",
      Content: "",
      LessonType: "",
      Ordinal: "",
      LStatus: "Approved",
    });
    setEditingLesson(null);
    setShowForm(true);
  };

  // Open Edit form
  const openEditForm = (lesson) => {
    setFormData({
      CourseID: lesson.CourseID,
      LName: lesson.LName,
      Content: lesson.Content,
      LessonType: lesson.LessonType,
      Ordinal: lesson.Ordinal,
      LStatus: lesson.LStatus,
    });
    setEditingLesson(lesson);
    setShowForm(true);
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="content">
        <div className="card-container">
          <h2 className="title">Admin • Lesson Management</h2>

          {/* Search & Filters */}
          <div className="filters">
            <input
              type="text"
              placeholder="Search lessons..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

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
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">-- Filter by Type --</option>
              <option value="Video">Video</option>
              <option value="Document">Document</option>
              <option value="Audio">Audio</option>
              <option value="Quiz">Quiz</option>
              <option value="Assignment">Assignment</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">-- Filter by Status --</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending approval</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Actions */}
          <div className="actions">
            <button className="btn btn-add" onClick={openAddForm}>
              + Add new lesson
            </button>
          </div>

          {/* Table */}
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>LessonID</th>
                  <th>Course</th>
                  <th>Lesson Name</th>
                  <th>Content</th>
                  <th>Type</th>
                  <th>Ordinal</th>
                  <th>Date Created</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {lessons.length > 0 ? (
                  lessons.map((lesson) => (
                    <tr key={lesson.LessonID}>
                      <td>{lesson.LessonID}</td>
                      <td>{lesson.CourseID}</td>
                      <td>{lesson.LName}</td>
                      <td>{lesson.Content}</td>
                      <td>{lesson.LessonType}</td>
                      <td>{lesson.Ordinal}</td>
                      <td>{lesson.CreatedAt}</td>
                      <td>{lesson.LStatus}</td>
                      <td>
                        <button
                          className="btn btn-edit"
                          onClick={() => openEditForm(lesson)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-delete"
                          onClick={() => handleDelete(lesson.LessonID)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="no-data">
                      No lessons found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Add/Edit */}
        {showForm && (
          <NewLesson
            courses={courses}
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            handleClose={() => setShowForm(false)}
            editingLesson={editingLesson}
          />
        )}
      </main>
    </div>
  );
}
