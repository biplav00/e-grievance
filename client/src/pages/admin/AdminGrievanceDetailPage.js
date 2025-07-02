import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import useDepartments from "../../hooks/useDepartments";
// import GrievanceDialogForm from "../../components/grievances/GrievanceDialogForm";
import { Button } from "@mui/material";

const AdminGrievanceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const { departments } = useDepartments(auth.token);
  const [grievance, setGrievance] = useState(null);

  const getDeptName = (deptRef) => {
    if (!deptRef) return "N/A";
    if (typeof deptRef === "string") {
      const dept = departments.find((d) => d && (d._id === deptRef || d.name === deptRef));
      return dept ? dept.name : deptRef;
    }
    if (typeof deptRef === "object") {
      return deptRef.name || "N/A";
    }
    return "N/A";
  };
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [photoDialog, setPhotoDialog] = useState(null);

  useEffect(() => {
    const fetchGrievance = async () => {
      try {
        const res = await axios.get(`/api/grievances/${id}`);
        setGrievance(res.data);
        setStatus(res.data.status);
      } catch (err) {
        setError("Could not fetch grievance details");
      } finally {
        setLoading(false);
      }
    };
    fetchGrievance();
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
    setSuccess("");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!grievance) return <div>Not found</div>;

  // No badge logic needed in detail page

  return (
    <div className="container py-4">
      <div className="card p-4 shadow">
        <h2 className="d-flex align-items-center gap-3">
          Grievance Details
          <span
            className={
              status === "Resolved"
                ? "badge bg-success"
                : status === "In Progress"
                ? "badge bg-warning text-dark"
                : "badge bg-secondary"
            }
            style={{ fontSize: "0.6em", padding: "0.2em 0.5em", verticalAlign: "middle" }}
          >
            {status}
          </span>
        </h2>
        {success && <div className="alert alert-success">{success}</div>}
        <p>
          <strong>Tracking ID:</strong> {grievance.trackingId}
        </p>
        <p>
          <strong>Category:</strong> {grievance.category ? grievance.category : <span className="text-muted">N/A</span>}
        </p>
        <p>
          <strong>Department:</strong> {getDeptName(grievance.department)}
        </p>
        <p>
          <strong>Description:</strong> {grievance.description}
        </p>
        <p>
          <strong>Address:</strong> {grievance.address}
        </p>
        <p>
          <strong>Submitted By:</strong> {grievance.submittedBy?.email}
        </p>
        <p>
          <strong>Submitted On:</strong> {new Date(grievance.createdAt).toLocaleString()}
        </p>
        {grievance.photos && grievance.photos.length > 0 && (
          <div className="mb-3">
            <strong>Photos:</strong>
            <div className="d-flex gap-2 flex-wrap mt-2">
              {grievance.photos.map((photo, i) => (
                <img
                  key={i}
                  src={typeof photo === "string" ? `/uploads/${photo.replace(/^uploads[\\/]/, "")}` : photo.url}
                  alt="grievance"
                  style={{
                    width: 100,
                    height: 100,
                    objectFit: "cover",
                    borderRadius: 4,
                    border: "1px solid #ccc",
                    cursor: "pointer",
                  }}
                  onClick={() => setPhotoDialog(`/uploads/${photo.replace(/^uploads\//, "")}`)}
                />
              ))}
            </div>
          </div>
        )}
        <hr></hr>
        <div className="mb-3">
          <label className="form-label">
            <strong>Status:</strong>
          </label>
          <div className="d-flex align-items-center gap-3">
            <select value={status} onChange={handleStatusChange} className="form-select w-auto">
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">
            <strong>Admin Feedback:</strong>
          </label>
          <textarea
            className="form-control"
            rows={3}
            value={grievance.feedback || ""}
            onChange={(e) => setGrievance((g) => ({ ...g, feedback: e.target.value }))}
            placeholder="Enter feedback for citizen..."
          />
        </div>
        <div className="d-flex gap-2 mt-2">
          <Button
            variant="contained"
            onClick={async () => {
              setSaving(true);
              setError("");
              setSuccess("");
              try {
                await axios.put(
                  `/api/grievances/${id}`,
                  { status, feedback: grievance.feedback },
                  { headers: { "x-auth-token": auth.token } }
                );
                // Re-fetch grievance to get latest feedback/status from backend
                const res = await axios.get(`/api/grievances/${id}`);
                setGrievance(res.data);
                setStatus(res.data.status);
                setSuccess("Status and feedback updated successfully.");
              } catch (err) {
                setError("Failed to update status/feedback");
              } finally {
                setSaving(false);
              }
            }}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outlined" onClick={() => navigate("/admin/grievances")}>
            Back
          </Button>
        </div>
        {photoDialog && (
          <div
            className="modal show d-block"
            tabIndex="-1"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setPhotoDialog(null)}
          >
            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: "90vw", width: "60vw" }}>
              <div className="modal-content p-2" style={{ background: "#222" }}>
                <img
                  src={photoDialog}
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

export default AdminGrievanceDetailPage;
