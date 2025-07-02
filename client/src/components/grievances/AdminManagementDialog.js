import React, { useState, useEffect } from "react";

const AdminManagementDialog = ({ open, onClose, onSave, admin, departments }) => {
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    department: departments[0] || "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (admin) {
      setForm({
        fullname: admin.fullname || "",
        email: admin.email,
        department: admin.department,
        password: "",
        confirmPassword: "",
      });
    } else {
      setForm({ fullname: "", email: "", department: departments[0] || "", password: "", confirmPassword: "" });
    }
    setError("");
  }, [admin, departments]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullname) return setError("Fullname is required");
    if (!form.email) return setError("Email is required");
    if (!admin) {
      if (!form.password) return setError("Password is required");
      if (form.password.length < 6) return setError("Password must be at least 6 characters");
      if (form.password !== form.confirmPassword) return setError("Passwords do not match");
    }
    const submitForm = { ...form };
    if (admin) {
      delete submitForm.password;
      delete submitForm.confirmPassword;
    }
    onSave(submitForm);
  };

  if (!open) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3 className="mb-3">{admin ? "Edit Admin" : "Add New Admin"}</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Fullname</label>
              <input
                name="fullname"
                value={form.fullname}
                onChange={handleChange}
                required
                type="text"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                type="email"
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Department</label>
              <select name="department" value={form.department} onChange={handleChange} className="form-select">
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Show password fields only when adding */}
            {!admin && (
              <>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    type="password"
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    required
                    type="password"
                    className="form-control"
                  />
                </div>
              </>
            )}
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {admin ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminManagementDialog;
