import React, { useState } from "react";
import axios from "axios";

const AddAdminPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "", department: "Public Works" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    try {
      const res = await axios.post("/api/auth/register-by-admin", formData);
      setMessage(res.data.msg);
      setFormData({ email: "", password: "", department: "Public Works" });
    } catch (err) {
      setError(err.response?.data?.msg || "An error occurred.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Admin User</h2>
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>New Admin Email</label>
          <input type="email" name="email" value={formData.email} onChange={onChange} required />
        </div>
        <div className="form-group">
          <label>Temporary Password</label>
          <input type="password" name="password" value={formData.password} onChange={onChange} required minLength="6" />
        </div>
        <div className="form-group">
          <label>Department</label>
          <select name="department" value={formData.department} onChange={onChange}>
            <option value="Public Works">Public Works</option>
            <option value="Water Dept">Water Dept</option>
            <option value="Electricity Dept">Electricity Dept</option>
          </select>
        </div>
        <button type="submit">Create Admin</button>
      </form>
    </div>
  );
};
export default AddAdminPage;
