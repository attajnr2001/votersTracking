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
import {
  useAddVoterMutation,
  useGetConstituenciesQuery,
  votersApiSlice,
} from "../slices/votersApiSlice";

const AddUserDialog = ({ open, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // New state for role
  const [psCode, setPsCode] = useState("");

  const [addUser] = useAddUserMutation();
  const {
    data: constituencies,
    error,
    isLoading: isLoadingConstituencies,
  } = useGetConstituenciesQuery();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addUser({ name, email, password, role, psCode }).unwrap(); // Include role in the mutation
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
        <TextField
          select
          label="Constituency"
          variant="outlined"
          fullWidth
          value={psCode}
          onChange={(e) => setPsCode(e.target.value)}
          disabled={isLoadingConstituencies}
          margin="dense"
        >
          {constituencies &&
            constituencies.map((constituency) => (
              <MenuItem key={constituency.psCode} value={constituency.psCode}>
                {constituency.name}
              </MenuItem>
            ))}
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
