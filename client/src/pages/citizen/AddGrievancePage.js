import React, { useContext, useEffect } from "react";
import GrievanceForm from "../../components/grievances/GrievanceForm";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AddGrievancePage = () => {
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.user && auth.user.role !== "citizen") {
      navigate("/dashboard");
    }
  }, [auth, navigate]);

  return (
    <div className="container py-4">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: 600 }}>
        <h1 className="mb-4">Submit a New Grievance</h1>
        <GrievanceForm />
      </div>
    </div>
  );
};

export default AddGrievancePage;
