import React, { useState, useEffect } from "react";
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
import { useSelector, useDispatch } from "react-redux";
import {
  useAddVoterMutation,
  useGetConstituenciesQuery,
  votersApiSlice,
} from "../slices/votersApiSlice";
import { useNavigate } from "react-router-dom";

const AddSingleVoter = ({ open, onClose }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [surname, setSurname] = useState("");
  const [otherNames, setOtherNames] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [age, setAge] = useState("");
  const [psCode, setPsCode] = useState(
    userInfo.psCode !== "all" ? userInfo.psCode : ""
  );
  const [sex, setSex] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dor, setDor] = useState("2020-12-01T00:00:00.000+00:00");
  const [image, setImage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isImageSizeValid, setIsImageSizeValid] = useState(true);

  const dispatch = useDispatch();
  const [addVoter, { isLoading }] = useAddVoterMutation();
  const {
    data: constituencies,
    error,
    isLoading: isLoadingConstituencies,
  } = useGetConstituenciesQuery();

  const handleIdNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setIdNumber(value);
    }
  };

  const handleAgeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (parseInt(value) <= 120) {
      setAge(value);
    }
  };

  const checkFormValidity = () => {
    return (
      surname.trim() !== "" &&
      otherNames.trim() !== "" &&
      age !== "" &&
      psCode !== "" &&
      sex !== "" &&
      idNumber.trim() !== "" &&
      dor !== ""
    );
  };

  useEffect(() => {
    setIsFormValid(checkFormValidity());
  }, [surname, otherNames, age, psCode, sex, idNumber, dor]);

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
      if (file.size > 1.5 * 1024 * 1024) {
        // 1.5MB in bytes
        setIsImageSizeValid(false);
        handleSnackbarOpen("Image size should not exceed 1.5MB", "warning");
      } else {
        setIsImageSizeValid(true);
        setImageFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
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
    setIsSaving(true);
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
      }

      const res = await addVoter({
        surname,
        otherNames,
        age: parseInt(age),
        psCode,
        sex,
        idNumber,
        dor,
        image: imageUrl,
      }).unwrap();
      dispatch(votersApiSlice.util.invalidateTags(["Voter"]));

      setSurname("");
      setOtherNames("");
      setAge("");
      setPsCode("");
      setSex("");
      setIdNumber("");
      setDor("");
      setImage("");
      setImageFile(null);
      setIsSaving(false);

      onClose();

      handleSnackbarOpen("Voter added successfully", "success");
    } catch (err) {
      console.error(err);
      handleSnackbarOpen(err?.data?.message || "Error adding voter", "error");
    } finally {
      setIsSaving(false);
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
        <DialogTitle color={"secondary"} fontWeight={"bold"}>
          ADD NEW VOTER
        </DialogTitle>
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
                label="Age"
                variant="outlined"
                fullWidth
                value={age}
                onChange={handleAgeChange}
                inputProps={{
                  maxLength: 3,
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                }}
              />
            </Grid>
            {userInfo.psCode === "all" && (
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
            )}
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
                onChange={handleIdNumberChange}
                inputProps={{
                  maxLength: 10,
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                }}
              />
            </Grid>
            <Grid item xs={12}>
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
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            disabled={isSaving || !isFormValid || !isImageSizeValid}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
