import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const AddGroup = ({
  open,
  onClose,
  formData,
  editingId,
  handleInputChange,
  handleSubmit,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color={"secondary"}>
        {editingId ? "EDIT GROUP" : "ADD GROUP"}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Group Name"
          type="text"
          fullWidth
          value={formData.name}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="leaderName"
          label="Leader's Name"
          type="text"
          fullWidth
          value={formData.leaderName}
          onChange={handleInputChange}
        />
        <TextField
          margin="dense"
          name="leaderPhone"
          label="Leader's Phone"
          type="tel"
          fullWidth
          value={formData.leaderPhone}
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

export default AddGroup;
