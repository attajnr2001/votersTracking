import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";
import { useAddUserMutation } from "../slices/usersApiSlice";

const AddUserDialog = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // New state for role

  const [addUser] = useAddUserMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser({ name, email, password, role }).unwrap(); // Include role in the mutation
      onClose();
    } catch (err) {
      console.error("Failed to add user:", err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Name"
          type="text"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Password"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          select
          margin="dense"
          label="Role"
          fullWidth
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <MenuItem value="admin">Admin</MenuItem>
          <MenuItem value="super">Super</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary" variant="contained">
          Add User
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddUserDialog;
