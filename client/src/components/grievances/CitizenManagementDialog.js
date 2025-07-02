import React, { useState, useEffect } from "react";

const CitizenManagementDialog = ({ open, onClose, onSave, citizen }) => {
  const [form, setForm] = useState({ fullname: "", email: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (citizen) {
      setForm({ fullname: citizen.fullname || "", email: citizen.email });
    } else {
      setForm({ fullname: "", email: "" });
    }
    setError("");
  }, [citizen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.fullname) return setError("Fullname is required");
    if (!form.email) return setError("Email is required");
    onSave(form);
  };

  if (!open) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3 className="mb-3">{citizen ? "Edit Citizen" : "Add New Citizen"}</h3>
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
                disabled={!!citizen}
              />
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {citizen ? "Save" : "Add"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CitizenManagementDialog;
