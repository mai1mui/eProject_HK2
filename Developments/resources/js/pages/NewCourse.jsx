import React from "react";

export default function NewCourse({
  creators,
  formData,
  setFormData,
  handleSubmit,
  handleClose,
  editingCourse,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>{editingCourse ? "Edit Course" : "Add Course"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Course Name"
            value={formData.CName}
            onChange={(e) =>
              setFormData({ ...formData, CName: e.target.value })
            }
            required
          />
          <textarea
            placeholder="Description"
            value={formData.CDescription}
            onChange={(e) =>
              setFormData({ ...formData, CDescription: e.target.value })
            }
            required
          />
          <input
            type="date"
            value={formData.StartDate}
            onChange={(e) =>
              setFormData({ ...formData, StartDate: e.target.value })
            }
            required
          />
          <select
            value={formData.CreatorID}
            onChange={(e) =>
              setFormData({ ...formData, CreatorID: e.target.value })
            }
            required
          >
            <option value="">Select Creator</option>
            {creators.map((c) => (
              <option key={c.AccountID} value={c.AccountID}>
                {c.AName}
              </option>
            ))}
          </select>
          <select
            value={formData.CStatus}
            onChange={(e) =>
              setFormData({ ...formData, CStatus: e.target.value })
            }
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

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
