import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import GrievanceList from "../../components/grievances/GrievanceList";
import { AuthContext } from "../../context/AuthContext";
import useDepartments from "../../hooks/useDepartments";

const ViewGrievancesPage = () => {
  const [grievances, setGrievances] = useState([]);
  const { departments } = useDepartments();
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await axios.get("/api/grievances"); // fetch all grievances
        setGrievances(res.data);
      } catch (err) {
        console.error("Could not fetch grievances", err);
      }
    };
    fetchGrievances();
  }, [auth.user]);

  const handleStatusChange = async (id, status) => {
    try {
      const res = await axios.put(`/api/grievances/${id}/status`, { status });
      setGrievances(grievances.map((g) => (g._id === id ? { ...g, status: res.data.status } : g)));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <div className="container py-4">
      <div className="card p-3 shadow">
        <GrievanceList
          grievances={grievances}
          title="All Grievances"
          onStatusChange={handleStatusChange}
          departments={departments}
          onViewDetail={(id) => navigate(`/admin/grievances/${id}`)}
        />
      </div>
    </div>
  );
};
export default ViewGrievancesPage;
