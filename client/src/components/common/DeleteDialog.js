import React from "react";

const DeleteDialog = ({ open, onClose, onConfirm, text = "Are you sure you want to delete this item?" }) => {
  if (!open) return null;
  return (
    <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.2)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content p-4">
          <h3>Confirm Delete</h3>
          <p>{text}</p>
          <div className="d-flex gap-2 justify-content-end">
            <button onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
            <button onClick={onConfirm} className="btn btn-danger">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteDialog;
