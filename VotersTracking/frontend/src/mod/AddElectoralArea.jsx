import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AddElectoralArea = ({
  open,
  onClose,
  formData,
  editingId,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {editingId ? "EDIT ELECTORAL AREA" : "ADD ELECTORAL AREA"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Name"
          type="text"
          fullWidth
          variant="standard"
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="psCode"
          label="PS Code"
          type="text"
          fullWidth
          variant="standard"
          value={formData.psCode}
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button color="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddElectoralArea;
