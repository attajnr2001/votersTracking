import React, { useState } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
  Snackbar,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AddGallery = ({
  open,
  onClose,
  formData,
  editingId,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  imagePreview,
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const onSubmit = async () => {
    try {
      await handleSubmit();
      setSnackbar({
        open: true,
        message: editingId
          ? "Gallery edited successfully!"
          : "Gallery added successfully!",
        severity: "success",
      });
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Error saving gallery. Please try again.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle color={"secondary"}>
          {editingId ? "EDIT GALLERY" : "ADD GALLERY"}
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
            name="year"
            label="Year"
            type="number"
            fullWidth
            variant="standard"
            value={formData.year}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="standard"
            value={formData.location}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            variant="standard"
            value={formData.description}
            onChange={handleInputChange}
          />
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
              sx={{ mt: 2 }}
            >
              Upload Image
            </Button>
          </label>
          {imagePreview && (
            <Box display="flex" alignItems="center" mt={2}>
              <Avatar sx={{ width: 100, height: 100 }} src={imagePreview} />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="contained" onClick={onSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddGallery;
