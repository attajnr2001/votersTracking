import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const EditMemberDialog = ({ open, onClose, member, onSubmit }) => {
  const [editedMember, setEditedMember] = useState({
    name: "",
    number: "",
    gender: "",
    age: "",
    occupation: "",
  });

  useEffect(() => {
    if (member) {
      setEditedMember({
        name: member.name || "",
        number: member.number || "",
        gender: member.gender || "",
        age: member.age || "",
        occupation: member.occupation || "",
      });
    }
  }, [member]);

  const handleChange = (e) => {
    setEditedMember({ ...editedMember, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(editedMember);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle color={"secondary"} sx={{fontWeight:"bold"}}>EDIT MEMBER</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <TextField
            name="name"
            label="Name"
            value={editedMember.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="number"
            label="Number"
            value={editedMember.number}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            name="gender"
            label="Gender"
            value={editedMember.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </TextField>
          <TextField
            name="age"
            label="Age"
            type="number"
            value={editedMember.age}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            name="occupation"
            label="Occupation"
            value={editedMember.occupation}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <DialogActions>
            <Button color="secondary" onClick={onClose}>Cancel</Button>
            <Button type="submit" color="primary" variant="contained"> 
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberDialog;
