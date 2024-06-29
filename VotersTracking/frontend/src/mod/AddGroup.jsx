import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { useGetConstituenciesQuery } from "../slices/constituenciesApiSlice";

const AddGroup = ({
  open,
  onClose,
  formData,
  editingId,
  handleInputChange,
  handleSubmit,
}) => {
  const { data: constituencies, isLoading } = useGetConstituenciesQuery();
  const [constituencyOptions, setConstituencyOptions] = useState([]);

  useEffect(() => {
    if (constituencies) {
      setConstituencyOptions(
        constituencies.map((c) => ({ value: c.psCode, label: c.name }))
      );
    }
  }, [constituencies]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editingId ? "Edit Group" : "Add Group"}</DialogTitle>
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
          type="text"
          fullWidth
          value={formData.leaderPhone}
          onChange={handleInputChange}
        />
        <FormControl fullWidth margin="dense">
          <InputLabel>Electoral Area</InputLabel>
          <Select
            name="electoralArea"
            value={formData.electoralArea}
            onChange={handleInputChange}
            label="constituency"
          >
            {constituencyOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit}>{editingId ? "Update" : "Add"}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGroup;
