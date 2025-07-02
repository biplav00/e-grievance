import React, { useContext } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { DataCacheProvider } from "./context/DataCacheContext";
import "bootstrap/dist/css/bootstrap.min.css";

import Header from "./components/layout/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MyDashboardPage from "./pages/citizen/MyDashboardPage";
import AddGrievancePage from "./pages/citizen/AddGrievancePage";
import GrievanceDetail from "./pages/citizen/GrievanceDetail";
import EditGrievancePage from "./pages/citizen/EditGrievancePage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import ViewGrievancesPage from "./pages/admin/ViewGrievancesPage";
import AdminDepartmentsPage from "./pages/admin/AdminDepartmentsPage";
import AdminManagementPage from "./pages/admin/AdminManagementPage";
import AdminGrievanceDetailPage from "./pages/admin/AdminGrievanceDetailPage";
import CitizenManagementPage from "./pages/admin/CitizenManagementPage";

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);
  if (!auth.isAuthenticated) return <Navigate to="/login" />;
  return children;
};

function App() {
  const { auth } = useContext(AuthContext);
  return (
    <DataCacheProvider>
      <Router>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                auth.user && auth.user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <PrivateRoute>
                    <MyDashboardPage />
                  </PrivateRoute>
                )
              }
            />
            <Route
              path="/dashboard/add-grievance"
              element={
                auth.user && auth.user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <PrivateRoute>
                    <AddGrievancePage />
                  </PrivateRoute>
                )
              }
            />
            <Route
              path="/dashboard/grievance/:id"
              element={
                auth.user && auth.user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <PrivateRoute>
                    <GrievanceDetail />
                  </PrivateRoute>
                )
              }
            />
            <Route
              path="/dashboard/grievance/:id/edit"
              element={
                auth.user && auth.user.role === "admin" ? (
                  <Navigate to="/admin/dashboard" />
                ) : (
                  <PrivateRoute>
                    <EditGrievancePage />
                  </PrivateRoute>
                )
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute>
                  <AdminLayout />
                </PrivateRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="grievances" element={<ViewGrievancesPage />} />
              <Route path="grievances/:id" element={<AdminGrievanceDetailPage />} />
              <Route path="settings/admins" element={<AdminManagementPage />} />
              <Route path="settings/departments" element={<AdminDepartmentsPage />} />
              <Route path="settings/citizens" element={<CitizenManagementPage />} />
              <Route path="settings" element={<Navigate to="settings/departments" />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </Router>
    </DataCacheProvider>
  );
}

export default App;
