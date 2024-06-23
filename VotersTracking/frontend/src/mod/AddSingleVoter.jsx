import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../helpers/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
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
  Snackbar,
  Alert,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { useDispatch } from "react-redux";
import {
  useAddVoterMutation,
  useGetConstituenciesQuery,
} from "../slices/votersApiSlice";
import { useNavigate } from "react-router-dom";

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
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const [addVoter, { isLoading }] = useAddVoterMutation();
  const {
    data: constituencies,
    error,
    isLoading: isLoadingConstituencies,
  } = useGetConstituenciesQuery();

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleCancel = () => {
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // This is for preview only
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = async (file) => {
    if (!file) return null;
    const fileRef = ref(storage, `voter_images/${uuidv4()}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSave = async () => {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
      }

      const res = await addVoter({
        surname,
        otherNames,
        dob,
        psCode,
        sex,
        idNumber,
        dor,
        image: imageUrl,
      }).unwrap();

      // Reset form state
      setSurname("");
      setOtherNames("");
      setDob("");
      setPsCode("");
      setSex("");
      setIdNumber("");
      setDor("");
      setImage("");
      setImageFile(null);

      onClose(); // Close dialog

      // Refresh the page
      navigate(0);
    } catch (err) {
      console.error(err);
      setSnackbarMessage("Error adding voter", err);
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <>
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

        {/* Snackbar for success or error */}
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddSingleVoter;
