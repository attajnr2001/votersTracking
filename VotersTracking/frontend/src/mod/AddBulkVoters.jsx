import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";

const AddBulkVoters = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = () => {
    // Handle file upload logic here (e.g., send file to server)
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      // Example: Send formData to backend endpoint using fetch or axios
      // Replace '/upload' with your actual backend endpoint
      fetch("/upload", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("File uploaded successfully:", data);
          onClose(); // Close dialog after handling file upload
        })
        .catch((error) => {
          console.error("Error uploading file:", error);
          // Handle error condition
        });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Upload Image File (JPEG or PNG)</DialogTitle>
      <DialogContent>
        <input
          type="file"
          accept="image/jpeg, image/png"
          onChange={handleFileChange}
          style={{ marginBottom: "10px" }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleUpload}
          color="primary"
          variant="contained"
          disabled={!selectedFile}
        >
          Upload
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddBulkVoters;
