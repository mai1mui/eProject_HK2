import React from "react";
import "../../css/LessonManagement.css"; // dùng chung css

export default function NewLesson({
  courses,
  formData,
  setFormData,
  handleSubmit,
  handleClose,
  editingLesson,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">
          {editingLesson ? "Edit Lesson" : "Add New Lesson"}
        </h3>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Course */}
          <label>Course</label>
          <select
            value={formData.CourseID}
            onChange={(e) =>
              setFormData({ ...formData, CourseID: e.target.value })
            }
            required
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.CourseID} value={c.CourseID}>
                {c.CName}
              </option>
            ))}
          </select>

          {/* Lesson Name */}
          <label>Lesson Name</label>
          <input
            type="text"
            placeholder="Enter lesson name"
            value={formData.LName}
            onChange={(e) =>
              setFormData({ ...formData, LName: e.target.value })
            }
            required
          />

          {/* Content */}
          <label>Content (link/file)</label>
          <input
            type="text"
            placeholder="e.g., link:intro01.pdf"
            value={formData.Content}
            onChange={(e) =>
              setFormData({ ...formData, Content: e.target.value })
            }
            required
          />

          {/* Lesson Type */}
          <label>Lesson Type</label>
          <select
            value={formData.LessonType}
            onChange={(e) =>
              setFormData({ ...formData, LessonType: e.target.value })
            }
            required
          >
            <option value="">Select Type</option>
            <option value="Video">Video</option>
            <option value="Document">Document</option>
            <option value="Audio">Audio</option>
            <option value="Quiz">Quiz</option>
            <option value="Assignment">Assignment</option>
          </select>

          {/* Ordinal */}
          <label>Ordinal</label>
          <input
            type="number"
            placeholder="Enter order (1,2,3..)"
            value={formData.Ordinal}
            onChange={(e) =>
              setFormData({ ...formData, Ordinal: e.target.value })
            }
            required
          />

          {/* Status */}
          <label>Status</label>
          <select
            value={formData.LStatus}
            onChange={(e) =>
              setFormData({ ...formData, LStatus: e.target.value })
            }
            required
          >
            <option value="Approved">Approved</option>
            <option value="Pending">Pending approval</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Buttons */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-cancel"
              onClick={handleClose}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-save">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
