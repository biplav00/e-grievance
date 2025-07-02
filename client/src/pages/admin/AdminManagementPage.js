import React, { useState, useEffect, useCallback, useMemo } from "react";
import axios from "axios";
import AdminManagementDialog from "../../components/grievances/AdminManagementDialog";
import ChangePasswordDialog from "../../components/grievances/ChangePasswordDialog";
import DeleteDialog from "../../components/common/DeleteDialog";
import useDepartments from "../../hooks/useDepartments";

const AdminManagementPage = () => {
  const [admins, setAdmins] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [changePasswordAdmin, setChangePasswordAdmin] = useState(null);

  const token = localStorage.getItem("token");
  const { departments, refetch: refetchDepartments } = useDepartments(token);
  const axiosConfig = useMemo(() => ({ headers: { "x-auth-token": token } }), [token]);

  const fetchAdmins = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/admins", axiosConfig);
      setAdmins(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Failed to load admins");
    }
    setLoading(false);
  }, [axiosConfig]);

  useEffect(() => {
    fetchAdmins();
  }, [fetchAdmins]);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["x-auth-token"] = token;
    } else {
      delete axios.defaults.headers.common["x-auth-token"];
    }
  }, [token]);

  const handleAdd = () => {
    setEditingAdmin(null);
    setDialogOpen(true);
  };

  const handleEdit = (admin) => {
    setEditingAdmin(admin);
    setDialogOpen(true);
  };

  const handleDelete = (admin) => {
    setDeleteTarget(admin);
    setDeleteDialogOpen(true);
  };

  const handleChangePassword = (admin) => {
    setChangePasswordAdmin(admin);
    setChangePasswordOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await axios.delete(`/api/admin/admins/${deleteTarget._id}`, axiosConfig);
      setMessage("Admin deleted");
      setDeleteDialogOpen(false);
      setDeleteTarget(null);
      fetchAdmins();
    } catch (err) {
      setError("Failed to delete admin");
    }
  };

  const handleDialogSave = async (form) => {
    setError("");
    setMessage("");
    try {
      if (editingAdmin) {
        await axios.put(`/api/admin/admins/${editingAdmin._id}`, form, axiosConfig);
        setMessage("Admin updated");
      } else {
        await axios.post("/api/auth/register-by-admin", form, axiosConfig);
        setMessage("Admin added");
      }
      setDialogOpen(false);
      fetchAdmins();
      refetchDepartments();
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to save admin");
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
      <h2 className="mb-4">Admin Management</h2>
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
      <button className="btn btn-primary mb-3" onClick={handleAdd}>
        + Add New Admin
      </button>
      {loading ? (
        <div className="alert alert-info">Loading...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Department</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((admin) => {
                const dept = departments.find((d) => d._id === admin.department || d.name === admin.department);
                return (
                  <tr key={admin._id}>
                    <td>{admin.fullname}</td>
                    <td>{admin.email}</td>
                    <td>{dept ? dept.name : admin.department}</td>
                    <td className="text-center">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => handleEdit(admin)}>
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-outline-warning me-2"
                        onClick={() => handleChangePassword(admin)}
                      >
                        Change Password
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(admin)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <AdminManagementDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleDialogSave}
        admin={editingAdmin}
        departments={departments}
      />
      <DeleteDialog
        open={deleteDialogOpen}
        onClose={() => {
          setDeleteDialogOpen(false);
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        text={deleteTarget ? `Are you sure you want to delete admin "${deleteTarget.email}"?` : ""}
      />
      <ChangePasswordDialog
        open={changePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
        onSave={async (form) => {
          // TODO: Implement API call to update password
          // Example:
          // await axios.post(`/api/admin/change-password`, form, axiosConfig);
          setChangePasswordOpen(false);
        }}
        admin={changePasswordAdmin}
      />
    </div>
  );
};

export default AdminManagementPage;
