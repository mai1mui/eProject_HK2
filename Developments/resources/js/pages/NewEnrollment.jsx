import React from "react";

export default function NewEnrollment({
  learners,
  courses,
  formData,
  setFormData,
  handleSubmit,
  handleClose,
  editingEnrollment,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3 className="modal-title">
          {editingEnrollment ? "Edit Enrollment" : "Add New Enrollment"}
        </h3>
        <form onSubmit={handleSubmit} className="form-container">
          {/* Learner */}
          <label>Learner</label>
          <select
            value={formData.AccountID}
            onChange={(e) =>
              setFormData({ ...formData, AccountID: e.target.value })
            }
            required
          >
            <option value="">Select learner</option>
            {learners.map((u) => (
              <option key={u.AccountID} value={u.AccountID}>
                {u.AName}
              </option>
            ))}
          </select>

          {/* Course */}
          <label>Course</label>
          <select
            value={formData.CourseID}
            onChange={(e) =>
              setFormData({ ...formData, CourseID: e.target.value })
            }
            required
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.CourseID} value={c.CourseID}>
                {c.CName}
              </option>
            ))}
          </select>

          {/* Registration date */}
          <label>Registration Date</label>
          <input
            type="date"
            value={formData.EnrollDate}
            onChange={(e) =>
              setFormData({ ...formData, EnrollDate: e.target.value })
            }
            required
          />

          {/* Status */}
          <label>Status</label>
          <select
            value={formData.EStatus}
            onChange={(e) =>
              setFormData({ ...formData, EStatus: e.target.value })
            }
            required
          >
            <option value="Paid">Paid</option>
            <option value="Processing">Processing</option>
            <option value="Not confirmed">Not confirmed</option>
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
