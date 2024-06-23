import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  MenuItem,
  Grid,
  Box,
  Typography,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useDispatch } from "react-redux";
import {
  useAddVoterMutation,
  useGetConstituenciesQuery,
} from "../slices/votersApiSlice";

const AddSingleVoter = ({ open, onClose }) => {
  const [surname, setSurname] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [dob, setDob] = useState("");
  const [psCode, setPsCode] = useState("");
  const [sex, setSex] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dor, setDor] = useState("");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const dispatch = useDispatch();
  const [addVoter, { isLoading }] = useAddVoterMutation();
  const {
    data: constituencies,
    error,
    isLoading: isLoadingConstituencies,
  } = useGetConstituenciesQuery();

  const handleCancel = () => {
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFile(file);
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const res = await addVoter({
        surname,
        otherNames,
        dob,
        psCode,
        sex,
        idNumber,
        dor,
        image,
      }).unwrap();
      console.log("added");
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Add New Voter</DialogTitle>
      <DialogContent>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Surname"
              variant="outlined"
              fullWidth
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Other Names"
              variant="outlined"
              fullWidth
              value={otherNames}
              onChange={(e) => setOtherNames(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Birth"
              type="date"
              variant="outlined"
              fullWidth
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Constituency"
              variant="outlined"
              fullWidth
              value={psCode}
              onChange={(e) => setPsCode(e.target.value)}
              disabled={isLoadingConstituencies}
            >
              {constituencies &&
                constituencies.map((constituency) => (
                  <MenuItem
                    key={constituency.psCode}
                    value={constituency.psCode}
                  >
                    {constituency.name}
                  </MenuItem>
                ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              select
              label="Sex"
              variant="outlined"
              fullWidth
              value={sex}
              onChange={(e) => setSex(e.target.value)}
            >
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="ID Number"
              variant="outlined"
              fullWidth
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Date of Registration"
              type="date"
              variant="outlined"
              fullWidth
              value={dor}
              onChange={(e) => setDor(e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={12}>
            {/* Input for selecting a file */}
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="image-input"
              type="file"
              onChange={handleFileChange}
            />
            <label htmlFor="image-input">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
              >
                Upload Image
              </Button>
            </label>
          </Grid>
          <Grid item xs={12}>
            {image && (
              <Box display="flex" alignItems="center">
                <Avatar sx={{ width: 100, height: 100 }} src={image} />
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddSingleVoter;
