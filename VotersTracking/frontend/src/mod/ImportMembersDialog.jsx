import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";

const ImportMembersDialog = ({
  open,
  onClose,
  onImport,
  isImporting,
  groupId,
}) => {
  const [member, setMember] = useState({
    name: "",
    voterId: "",
    gender: "",
    phone: "",
    occupation: "",
    age: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setMember((prevMember) => ({
      ...prevMember,
      [name]: value,
    }));
  };

  const handleAddMember = async () => {
    try {
      await onImport({ ...member, groupId });
      // Reset the form after successful import
      setMember({
        name: "",
        voterId: "",
        gender: "",
        phone: "",
        occupation: "",
        age: "",
      });
      onClose();
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Add Group Member</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                name="name"
                label="Name"
                value={member.name}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type={"number"}
                name="voterId"
                label="Voter's ID"
                value={member.voterId}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                name="gender"
                value={member.gender}
                onChange={handleInputChange}
                fullWidth
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select Gender
                </MenuItem>
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="phone"
                label="Phone"
                value={member.phone}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="occupation"
                label="Occupation"
                value={member.occupation}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="age"
                label="Age"
                type="number"
                value={member.age}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleAddMember}
            color="primary"
            disabled={isImporting || !member.name} // Disable if importing or name is empty
          >
            {isImporting ? <CircularProgress size={24} /> : "Add Member"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ImportMembersDialog;
