import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import GrievanceDialogForm from "../../components/grievances/GrievanceDialogForm";
import { Button } from "@mui/material";

const EditGrievancePage = () => {
  const { id } = useParams();
  const { auth } = useContext(AuthContext);
  const [initialData, setInitialData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const res = await axios.get(`/api/grievances/${id}`, {
          headers: { "x-auth-token": auth.token },
        });
        setInitialData(res.data);
      } catch (err) {
        setError("Could not fetch grievance details.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrievance();
  }, [id, auth.token]);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  if (loading)
    return (
      <div className="container py-4">
        <div className="alert alert-info">Loading...</div>
      </div>
    );
  if (error)
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  if (!initialData) return null;

  return (
    <div className="container py-4">
      <Button 
        variant="contained" 
        onClick={handleOpenDialog}
        sx={{ mb: 2 }}
      >
        Edit Grievance
      </Button>
      {openDialog && (
        <GrievanceDialogForm
          open={openDialog}
          onClose={handleCloseDialog}
          initialData={initialData}
          grievanceId={id}
        />
      )}
    </div>
  );
};

export default EditGrievancePage;
