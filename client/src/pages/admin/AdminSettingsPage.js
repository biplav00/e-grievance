import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminManagementPage from "./AdminManagementPage";

const AdminSettingsPage = () => (
  <div className="container py-4">
    <div className="card p-4 shadow mx-auto" style={{ maxWidth: 500 }}>
      <h2 className="mb-3">Settings</h2>
      <p>Please use the sidebar to select a settings option.</p>
    </div>
  </div>
);

export default AdminSettingsPage;

// Removed: replaced by AdminManagementPage.js and settings routes

// In your router config:
// {
//   path: "/admin/settings/admins",
//   element: <AdminManagementPage />,
// }

// Optionally, you can remove AddAdminPage.js and AdminAddPage.js if not needed anymore, as AdminManagementPage replaces them.
