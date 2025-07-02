import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import DeleteDialog from "../../components/common/DeleteDialog";
import CitizenManagementDialog from "../../components/grievances/CitizenManagementDialog";

const CitizenManagementPage = () => {
  const [citizens, setCitizens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCitizen, setEditingCitizen] = useState(null);

  const token = localStorage.getItem("token");
  const axiosConfig = useMemo(() => ({ headers: { "x-auth-token": token } }), [token]);

  const fetchCitizens = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/citizens", axiosConfig);
      setCitizens(res.data);
    } catch (err) {
      setError("Failed to load citizens");
    }
    setLoading(false);
  }, [axiosConfig]);

  useEffect(() => {
    fetchCitizens();
  }, [fetchCitizens]);

  const handleDelete = (citizen) => {
    setDeleteTarget(citizen);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (citizen) => {
    setEditingCitizen(citizen);
    setDialogOpen(true);
  };

  const handleDialogSave = async (form) => {
    setError("");
    setMessage("");
    try {
      await axios.put(`/api/admin/citizens/${editingCitizen._id}`, form, axiosConfig);
      setMessage("Citizen updated");
      setDialogOpen(false);
      setEditingCitizen(null);
      fetchCitizens();
    } catch (err) {
      setError("Failed to update citizen");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/admin/citizens/${deleteTarget._id}`, axiosConfig);
      setMessage("Citizen deleted");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchCitizens();
    } catch (err) {
      setError("Failed to delete citizen");
    }
  };

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  return (
    <div className="container py-4">
      <h2 className="mb-4">Citizen Management</h2>
      {message && (
        <div
          className="alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1055, minWidth: 300 }}
        >
          {message}
        </div>
      )}
      {error && (
        <div
          className="alert alert-danger position-fixed top-0 start-50 translate-middle-x mt-3"
          style={{ zIndex: 1055, minWidth: 300 }}
        >
          {error}
        </div>
      )}
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Registered On</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {citizens.map((citizen) => (
                <tr key={citizen._id}>
                  <td>{citizen.fullname || <span className="text-muted">N/A</span>}</td>
                  <td>{citizen.email}</td>
                  <td>{new Date(citizen.createdAt).toLocaleDateString()}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(citizen)}>
                      Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(citizen)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        text={deleteTarget ? `Are you sure you want to delete citizen "${deleteTarget.email}"?` : ""}
      />
      <CitizenManagementDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setEditingCitizen(null);
        }}
        onSave={handleDialogSave}
        citizen={editingCitizen}
      />
    </div>
  );
};

export default CitizenManagementPage;
