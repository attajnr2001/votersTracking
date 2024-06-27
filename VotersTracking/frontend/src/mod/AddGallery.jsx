import React from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Avatar,
} from "@mui/material";
import PhotoCamera from "@mui/icons-material/PhotoCamera";

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
  return (
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
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGallery;
