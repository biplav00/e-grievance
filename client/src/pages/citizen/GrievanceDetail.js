import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import GrievanceDialogForm from "../../components/grievances/GrievanceDialogForm";
import { Button } from "@mui/material";

const GrievanceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const [departments, setDepartments] = useState([]);
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dialogImg, setDialogImg] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("/api/department", {
          headers: { "x-auth-token": auth.token },
        });
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };

    if (auth.isAuthenticated) {
      fetchDepartments();
    }
  }, [auth]);

  const getDeptName = (deptRef) => {
    if (!deptRef) return "N/A";
    if (typeof deptRef === "string") {
      const dept = departments.find((d) => d && d._id === deptRef);
      return dept ? dept.name : deptRef;
    }
    if (typeof deptRef === "object") {
      return deptRef.name || "N/A";
    }
    return "N/A";
  };

  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/login");
      return;
    }
    const fetchGrievance = async () => {
      try {
        const res = await axios.get(`/api/grievances/${id}`, {
          headers: { "x-auth-token": auth.token },
        });
        setGrievance(res.data);
      } catch (err) {
        setError("Could not fetch grievance details.");
      } finally {
        setLoading(false);
      }
    };
    fetchGrievance();
  }, [id, auth, navigate]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/grievances/${grievance._id}`, {
        headers: { "x-auth-token": auth.token },
      });
      navigate("/citizen/dashboard");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to delete grievance.");
      setShowDeleteDialog(false);
    }
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (data) => {
    try {
      const submissionData = new FormData();
      submissionData.append("description", data.description);
      submissionData.append("address", data.address);
      submissionData.append("category", data.category);
      submissionData.append("department", data.department?._id || data.department);
      // Only append a new photo if the user selected one (data.photos is a File list/array)
      if (data.photos && data.photos.length > 0 && data.photos[0] instanceof File) {
        submissionData.append("photos", data.photos[0]);
      }
      await axios.put(`/api/grievances/${grievance._id}`, submissionData, {
        headers: {
          "x-auth-token": auth.token,
          "Content-Type": "multipart/form-data",
        },
      });
      const res = await axios.get(`/api/grievances/${grievance._id}`, {
        headers: { "x-auth-token": auth.token },
      });
      setGrievance(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to update grievance.");
    }
  };

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
  if (!grievance)
    return (
      <div className="container py-4">
        <div className="alert alert-warning">No grievance found.</div>
      </div>
    );

  return (
    <div className="container py-4">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: 600 }}>
        <h2 className="mb-3 d-flex align-items-center gap-3">
          Grievance Details
          <span
            className={
              grievance.status === "Resolved"
                ? "badge bg-success"
                : grievance.status === "In Progress"
                ? "badge bg-warning text-dark"
                : "badge bg-secondary"
            }
            style={{ fontSize: "0.6em", padding: "0.2em 0.5em", verticalAlign: "middle" }}
          >
            {grievance.status}
          </span>
        </h2>
        <p>
          <strong>Tracking ID:</strong> {grievance.trackingId}
        </p>
        <p>
          <strong>Category:</strong> {grievance.category?.name || grievance.category || "N/A"}
        </p>
        <p>
          <strong>Department:</strong> {grievance.department ? getDeptName(grievance.department) : "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {grievance.status}
        </p>
        <p>
          <strong>Submitted On:</strong> {new Date(grievance.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Description:</strong> {grievance.description}
        </p>
        <p>
          <strong>Address:</strong> {grievance.address}
        </p>
        {grievance.photos && grievance.photos.length > 0 && (
          <div className="mb-3">
            <strong>Photos:</strong>
            <div className="d-flex gap-2 flex-wrap mt-2">
              {grievance.photos.map((photo, i) => (
                <img
                  key={i}
                  src={photo.url + "?t=" + (grievance.updatedAt || grievance.createdAt)}
                  alt="grievance"
                  onClick={() => setDialogImg(photo.url + "?t=" + (grievance.updatedAt || grievance.createdAt))}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: "cover",
                    cursor: "pointer",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <div className="alert alert-info mt-4" style={{ fontSize: "1.1rem", background: "#f8f9fa" }}>
          <strong>Admin Feedback:</strong>
          <br />
          {grievance.feedback ? (
            <span>{grievance.feedback}</span>
          ) : (
            <span className="text-muted">No feedback from admin yet.</span>
          )}
        </div>
        {grievance.status === "Submitted" && (
          <div className="d-flex gap-2 mt-3">
            <Button variant="contained" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="contained" color="error" onClick={() => setShowDeleteDialog(true)}>
              Delete
            </Button>
          </div>
        )}
        <GrievanceDialogForm
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          initialData={{
            description: grievance.description,
            address: grievance.address,
            category: grievance.category ? grievance.category : "",
            department: grievance.department ? grievance.department : "",
            photos: grievance.photos ? grievance.photos : [],
          }}
          grievanceId={grievance._id}
          onGrievanceSubmitted={handleEditSubmit}
        />
        {showDeleteDialog && (
          <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Confirm Delete</h5>
                </div>
                <div className="modal-body">Are you sure you want to delete this grievance?</div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowDeleteDialog(false)}>
                    Cancel
                  </button>
                  <button type="button" className="btn btn-danger" onClick={handleDelete}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {dialogImg && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setDialogImg(null)}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "90vw", width: "60vw" }}>
              <div className="modal-content p-2" style={{ background: "#222" }}>
                <img
                  src={dialogImg}
                  alt="full"
                  className="img-fluid rounded"
                  style={{ width: "100%", maxHeight: "80vh", objectFit: "contain", background: "#222" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceDetail;
