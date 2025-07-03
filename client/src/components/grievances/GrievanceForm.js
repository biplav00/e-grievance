import React, { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import useDepartments from "../../hooks/useDepartments";

const GrievanceForm = ({ onGrievanceSubmitted, initialData, isEditMode, grievanceId, isDialog = false }) => {
  const [formData, setFormData] = useState(() => {
    if (initialData) {
      return {
        category: initialData.category || "",
        department: initialData.department?._id || initialData.department || "",
        description: initialData.description || "",
        address: initialData.address || "",
      };
    }
    return {
      category: "",
      department: "",
      description: "",
      address: "",
    };
  });
  const [photos, setPhotos] = useState([]);
  // Debug: log initialData to verify structure

  const [previews, setPreviews] = useState(() => {
    if (isEditMode && initialData?.photos) {
      return initialData.photos.map((photo) => (photo && photo.url ? photo.url : ""));
    }
    return [];
  });

  // Ensure previews update if initialData.photos changes (e.g., dialog opens after fetch)
  React.useEffect(() => {
    if (isEditMode && initialData?.photos) {
      setPreviews(initialData.photos.map((photo) => (photo && photo.url ? photo.url : "")));
    }
  }, [isEditMode, initialData?.photos]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dialogImg, setDialogImg] = useState(null);
  const { auth } = useContext(AuthContext);
  const token = auth.token;
  const { departments } = useDepartments(token);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const onDepartmentChange = (e) => {
    const department = e.target.value;
    setFormData((prev) => ({ ...prev, department }));
  };
  const onFileChange = (e) => {
    if (e.target.files.length > 1) {
      setError("You can only upload one photo.");
      return;
    }
    const file = e.target.files[0];
    // Only set File object, never a string or preview url
    setPhotos(file ? [file] : []);
    setPreviews(file ? [URL.createObjectURL(file)] : []);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      // If a parent handler is provided (edit mode/dialog), use it
      if (onGrievanceSubmitted) {
        onGrievanceSubmitted({
          ...formData,
          photos,
        });
      } else {
        // Otherwise, handle API call directly (add mode)
        const form = new FormData();
        form.append("category", formData.category);
        form.append("department", formData.department);
        form.append("description", formData.description);
        form.append("address", formData.address);
        if (photos && photos.length > 0) {
          form.append("photos", photos[0]);
        }
        console.log('Submitting grievance with token:', token);
        const response = await fetch("/api/grievances", {
          method: "POST",
          headers: {
            'x-auth-token': token,
          },
          body: form,
        });
        if (!response.ok) {
          throw new Error("Failed to submit grievance");
        }
        setMessage("Grievance submitted successfully!");
        // Optionally reset form
        setFormData({
          category: "",
          department: departments[0]?._id || "",
          description: "",
          address: "",
        });
        setPhotos([]);
        setPreviews([]);
      }
    } catch (err) {
      setError(err.message || "Error submitting grievance");
    }
  };

  return (
    <div className="p-2">
      {!isDialog && <h2 className="mb-3">{isEditMode ? "Edit Grievance" : "Report a New Grievance"}</h2>}
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <form id="grievance-form" onSubmit={onSubmit}>
        <div className="mb-3">
          <label className="form-label">Department</label>
          <select
            name="department"
            value={formData.department}
            onChange={onDepartmentChange}
            required
            className="form-select"
            disabled={isEditMode && !isDialog} // Allow department change in dialog edit mode
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept._id} value={dept._id}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={onChange}
            required
            className="form-control"
            placeholder="Enter category"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            required
            className="form-control"
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Photos</label>
          <input type="file" name="photos" onChange={onFileChange} accept="image/*" className="form-control" />
          {/* Show image name if in edit mode and image exists */}
          {isEditMode && initialData?.photos && initialData.photos.length > 0 && (
            <div className="mt-1 text-secondary" style={{ fontSize: '0.95em' }}>
              <em>Current file: {initialData.photos[0]?.name || initialData.photos[0]?.url?.split("/").pop()}</em>
            </div>
          )}
          <div className="d-flex gap-2 mt-2 flex-wrap">
            {previews.length === 0 && <div className="text-muted">No photos attached</div>}
            {previews.map((src, i) =>
              src ? (
                <div key={i} className="position-relative">
                  <img
                    src={src}
                    alt="preview"
                    onClick={() => setDialogImg(src)}
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      cursor: "pointer",
                      borderRadius: 4,
                      border: "1px solid #ccc",
                    }}
                  />
                </div>
              ) : null
            )}
          </div>
        </div>
        {!isDialog && (
          <button type="submit" className="btn btn-primary w-100">
            {isEditMode ? "Save Changes" : "Submit"}
          </button>
        )}
      </form>
      {dialogImg && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
          onClick={() => setDialogImg(null)}
        >
          <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: 600 }}>
            <div className="modal-content p-2" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <img
                src={dialogImg}
                alt="full"
                className="img-fluid rounded"
                style={{ maxWidth: '90vw', maxHeight: '80vh', width: 'auto', height: 'auto', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GrievanceForm;
