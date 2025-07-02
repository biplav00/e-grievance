import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({ fullname: "", email: "", password: "", password2: "" });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }
    if (!formData.fullname.trim()) {
      setError("Full name is required");
      return;
    }
    try {
      const api = require('../../api').default;
      await api.post("/api/auth/register", {
        fullname: formData.fullname,
        email: formData.email,
        password: formData.password,
      });
      setMessage("Registration successful! Please login.");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    }
  };

  return (
    <div>
      <h2 className="mb-3">Register as a Citizen</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={onChange}
            required
            minLength="6"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Confirm Password</label>
          <input
            type="password"
            name="password2"
            value={formData.password2}
            onChange={onChange}
            required
            minLength="6"
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
