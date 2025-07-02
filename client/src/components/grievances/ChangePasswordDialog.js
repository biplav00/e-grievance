import React, { useState } from "react";

const ChangePasswordDialog = ({ open, onClose, onSave, admin }) => {
  const [form, setForm] = useState({ prevPassword: "", newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.prevPassword || !form.newPassword || !form.confirmPassword) {
      setError("All fields are required");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    onSave({ ...form, adminId: admin._id });
  };

  if (!open) return null;
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3 className="mb-3">Change Password</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Previous Password</label>
              <input
                name="prevPassword"
                value={form.prevPassword}
                onChange={handleChange}
                required
                type="password"
                className="form-control"
                autoComplete="current-password"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">New Password</label>
              <input
                name="newPassword"
                value={form.newPassword}
                onChange={handleChange}
                required
                type="password"
                className="form-control"
                autoComplete="new-password"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Confirm New Password</label>
              <input
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                required
                type="password"
                className="form-control"
                autoComplete="new-password"
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePasswordDialog;
