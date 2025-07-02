import React, { useState, useEffect } from "react";
import axios from "axios";
import DeleteDialog from "../../components/common/DeleteDialog";
import useDepartments from "../../hooks/useDepartments";

const DepartmentDialog = ({ open, onClose, onSave, department }) => {
  const initialName = department && typeof department === "object" && department.name ? department.name : "";
  const [name, setName] = useState(initialName);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setName(department && typeof department === "object" && department.name ? department.name : "");
    setError("");
    setTouched(false);
  }, [department]);

  const validate = (value) => {
    if (!value || typeof value !== "string" || !value.trim()) {
      return "Department name is required";
    }
    return "";
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validate(name));
  };

  const handleChange = (e) => {
    setName(e.target.value);
    if (touched) {
      setError(validate(e.target.value));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    const validationError = validate(name);
    if (validationError) return setError(validationError);
    onSave(name.trim());
  };

  if (!open) return null;
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3>{department ? "Edit Department" : "Add Department"}</h3>
          {error && <div className="alert alert-danger">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Department Name</label>
              <input value={name} onChange={handleChange} onBlur={handleBlur} className="form-control" autoFocus />
            </div>
            <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              {department ? "Save" : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminDepartmentsPage = () => {
  const token = localStorage.getItem("token");
  const axiosConfig = { headers: { "x-auth-token": token } };
  const { departments, loading, refetch } = useDepartments(token);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [message, setMessage] = useState("");
  const [errorMsg, setError] = useState("");

  const handleAdd = () => {
    setEditingDept(null);
    setDialogOpen(true);
  };

  const handleEdit = (dept) => {
    setEditingDept(dept);
    setDialogOpen(true);
  };

  const handleDelete = (dept) => {
    setDeleteTarget(dept);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/department/${deleteTarget.name}/`, axiosConfig);
      setMessage("Department deleted");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      refetch();
    } catch (err) {
      setError("Failed to delete department");
    }
  };

  const handleDialogSave = async (name) => {
    setError("");
    setMessage("");
    try {
      if (editingDept) {
        await axios.put(`/api/department/${editingDept.name}/`, { newName: name }, axiosConfig);
        setMessage("Department updated");
      } else {
        await axios.post("/api/department/", { name: name }, axiosConfig);
        setMessage("Department added");
      }
      setDialogOpen(false);
      setEditingDept(null);
      refetch();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save department");
    }
  };

  useEffect(() => {
    if (message || errorMsg) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, errorMsg]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Department Management</h2>
      {message && (
        <div
          className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1055, minWidth: 300 }}
        >
          {message}
        </div>
      )}
      {errorMsg && (
        <div
          className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1055, minWidth: 300 }}
        >
          {errorMsg}
        </div>
      )}
      <button onClick={handleAdd} className="btn btn-primary mb-3">
        + Add Department
      </button>
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Department</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept) => (
                <tr key={dept._id}>
                  <td>{dept.name}</td>
                  <td className="text-center">
                    <>
                      <button onClick={() => handleEdit(dept)} className="btn btn-sm btn-outline-secondary me-2">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(dept)} className="btn btn-sm btn-outline-danger">
                        Delete
                      </button>
                    </>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DepartmentDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingDept(null);
        }}
        onSave={handleDialogSave}
        department={editingDept}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        text={deleteTarget ? `Are you sure you want to delete department "${deleteTarget.name}"?` : ""}
      />
    </div>
  );
};

export default AdminDepartmentsPage;
