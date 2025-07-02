import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GrievanceList from "../../components/grievances/GrievanceList";
import useDepartments from "../../hooks/useDepartments";
import { AuthContext } from "../../context/AuthContext";
import AdminDashboardPage from "../admin/AdminDashboardPage";

const MyDashboardPage = () => {
  const [myGrievances, setMyGrievances] = useState([]);
  const { departments } = useDepartments();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);

  useEffect(() => {
    if (auth.user && auth.user.role === "citizen") {
      const fetchMyGrievances = async () => {
        try {
          const res = await axios.get("/api/grievances/my-grievances");
          setMyGrievances(res.data);
        } catch (err) {
          console.error("Could not fetch user grievances", err);
        }
      };
      fetchMyGrievances();
    }
  }, [auth.user]);

  if (auth.user && auth.user.role === "admin") {
    return <AdminDashboardPage />;
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-end">
        <button className="btn btn-primary mb-3" onClick={() => navigate("/dashboard/add-grievance")}>
          + Add New Grievance
        </button>
      </div>
      <div>
        <GrievanceList
          grievances={myGrievances}
          title="My Submitted Grievances"
          onViewDetail={(id) => navigate(`/dashboard/grievance/${id}`)}
          departments={departments}
        />
      </div>
    </div>
  );
};
export default MyDashboardPage;
