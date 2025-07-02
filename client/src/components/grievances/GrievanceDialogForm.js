import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import GrievanceForm from "./GrievanceForm";

const GrievanceDialogForm = ({ 
  open, 
  onClose, 
  initialData, 
  grievanceId,
  onGrievanceSubmitted 
}) => {
  const handleSubmit = (data) => {
    if (onGrievanceSubmitted) {
      onGrievanceSubmitted(data);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Edit Grievance</DialogTitle>
      <DialogContent>
          <GrievanceForm
            initialData={initialData}
            isEditMode={true}
            grievanceId={grievanceId}
            onGrievanceSubmitted={handleSubmit}
            isDialog={true}
          />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          type="submit" 
          form="grievance-form" 
          variant="contained"
          color="primary"
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GrievanceDialogForm;
