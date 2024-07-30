import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";

const AddBulkVoters = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Define the coordinates for each field (adjust these based on your image)
  const fieldCoordinates = [
    { name: "voterId", x: 100, y: 20, width: 150, height: 20 },
    { name: "age", x: 100, y: 40, width: 50, height: 20 },
    { name: "sex", x: 200, y: 40, width: 50, height: 20 },
    { name: "name", x: 100, y: 60, width: 200, height: 20 },
    { name: "photo", x: 400, y: 20, width: 100, height: 120 },
  ];

  const extractTextFromRegion = (ctx, x, y, width, height) => {
    const imageData = ctx.getImageData(x, y, width, height);
    // Here you would implement or use a library for OCR on this specific region
    // For demonstration, we'll return a placeholder string
    return `Extracted from (${x},${y},${width},${height})`;
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const image = await createImageBitmap(selectedFile);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        const voterData = [];
        const entryHeight = 140; // Adjust based on your image layout
        const numEntries = Math.floor(image.height / entryHeight);

        for (let i = 0; i < numEntries; i++) {
          const voter = {};
          const yOffset = i * entryHeight;

          fieldCoordinates.forEach((field) => {
            if (field.name === "photo") {
              // Extract photo
              const photoCanvas = document.createElement("canvas");
              photoCanvas.width = field.width;
              photoCanvas.height = field.height;
              photoCanvas
                .getContext("2d")
                .drawImage(
                  canvas,
                  field.x,
                  field.y + yOffset,
                  field.width,
                  field.height,
                  0,
                  0,
                  field.width,
                  field.height
                );
              // Create download link for the profile picture
              const downloadLink = document.createElement("a");
              downloadLink.href = photoCanvas.toDataURL("image/png");
              downloadLink.download = `voter_${i + 1}_profile.png`;
              downloadLink.click();
            } else {
              // Extract text for other fields
              voter[field.name] = extractTextFromRegion(
                ctx,
                field.x,
                field.y + yOffset,
                field.width,
                field.height
              );
            }
          });

          voterData.push(voter);
          console.log("Voter Details:", voter);
        }

        setExtractedData(voterData);
        setSnackbar({
          open: true,
          message:
            "Voter data extracted and profile pictures downloaded successfully!",
          severity: "success",
        });
      } catch (error) {
        console.error("Error processing image:", error);
        setSnackbar({
          open: true,
          message: "Error processing image: " + error.message,
          severity: "error",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Upload Voter Registration Image</DialogTitle>
        <DialogContent>
          <input
            ref={fileInputRef}
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
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Processing..." : "Extract Voter Data"}
          </Button>
        </DialogActions>

        {extractedData.length > 0 && (
          <DialogContent>
            <TextField
              label="Extracted Voter Data"
              multiline
              rows={10}
              variant="outlined"
              fullWidth
              value={JSON.stringify(extractedData, null, 2)}
              InputProps={{
                readOnly: true,
              }}
            />
          </DialogContent>
        )}
      </Dialog>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
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

export default AddBulkVoters;
