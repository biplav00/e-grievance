import React, { useState } from "react";
import axios from "axios";

const AdminAddPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      await axios.post("/api/admin/add", { email, password });
      setMessage("Admin added successfully");
      setEmail("");
      setPassword("");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to add admin");
    }
  };

  return (
    <div className="container py-4">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: 400 }}>
        <h2 className="mb-3">Add New Admin</h2>
        {message && <div className="alert alert-success">{message}</div>}
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleAddAdmin}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Add Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminAddPage;
