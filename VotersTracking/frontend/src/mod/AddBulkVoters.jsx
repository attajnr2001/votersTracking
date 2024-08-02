import React, { useState, useRef } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";

const AddBulkVoters = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
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

  const cmToPixels = (cm, image) => Math.round((cm / 21.9) * image.height);

  const extractPhotos = async (image, coordinates) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const photoWidth = cmToPixels(2.4, image);
    const photoHeight = cmToPixels(2.8, image);

    console.log(`Image dimensions: ${image.width}x${image.height}`);
    console.log(`Photo dimensions: ${photoWidth}x${photoHeight}`);

    const extractPhoto = (x, y, index) => {
      console.log(`Attempting to extract photo ${index + 1} at (${x}, ${y})`);

      if (x + photoWidth > image.width || y + photoHeight > image.height) {
        console.error(`Photo ${index + 1} is out of bounds`);
        return false;
      }

      const photoCanvas = document.createElement("canvas");
      photoCanvas.width = photoWidth;
      photoCanvas.height = photoHeight;
      const photoCtx = photoCanvas.getContext("2d");

      try {
        photoCtx.drawImage(
          canvas,
          x,
          y,
          photoWidth,
          photoHeight,
          0,
          0,
          photoWidth,
          photoHeight
        );

        const downloadLink = document.createElement("a");
        downloadLink.href = photoCanvas.toDataURL("image/png");
        downloadLink.download = `voter_${index + 1}_profile.png`;
        downloadLink.click();

        console.log(`Successfully extracted and downloaded photo ${index + 1}`);
        return true;
      } catch (error) {
        console.error(`Error extracting photo ${index + 1}:`, error);
        return false;
      }
    };

    const extractedPhotos = coordinates
      .map((coord, index) => {
        if (extractPhoto(coord.x, coord.y, index)) {
          return { index, x: coord.x, y: coord.y };
        }
        return null;
      })
      .filter((photo) => photo !== null);

    console.log("Extracted photos:", extractedPhotos);
    console.log("Extracted photo count:", extractedPhotos.length);
    console.log(
      "Failed extractions:",
      coordinates.length - extractedPhotos.length
    );
    return extractedPhotos.length;
  };

  const extractPreviousPhotos = async (image) => {
    const coordinates = [
      { x: cmToPixels(6, image), y: cmToPixels(0.5, image) },
      { x: cmToPixels(15.1, image), y: cmToPixels(0.5, image) },
      { x: cmToPixels(6, image), y: cmToPixels(4.11, image) },
      { x: cmToPixels(15.1, image), y: cmToPixels(4.11, image) },
      { x: cmToPixels(6, image), y: cmToPixels(7.72, image) },
      { x: cmToPixels(15.1, image), y: cmToPixels(7.72, image) },
      { x: cmToPixels(6, image), y: cmToPixels(11.33, image) },
      { x: cmToPixels(15.1, image), y: cmToPixels(11.33, image) },
      { x: cmToPixels(6, image), y: cmToPixels(14.94, image) },
      { x: cmToPixels(15.1, image), y: cmToPixels(14.94, image) },
    ];
    return extractPhotos(image, coordinates);
  };

  const extractLastTwoPhotos = async (image) => {
    const coordinates = [
      { x: cmToPixels(6.1, image), y: cmToPixels(18.55, image) },
      { x: cmToPixels(15.2, image), y: cmToPixels(18.55, image) },
    ];
    return extractPhotos(image, coordinates);
  };

  const handleUpload = async (extractionFunction) => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const image = await createImageBitmap(selectedFile);
        const extractedCount = await extractionFunction(image);

        setSnackbar({
          open: true,
          message: `Successfully extracted ${extractedCount} photos!`,
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
            onClick={() => handleUpload(extractPreviousPhotos)}
            color="primary"
            variant="contained"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Processing..." : "Extract Previous 10"}
          </Button>
          <Button
            onClick={() => handleUpload(extractLastTwoPhotos)}
            color="primary"
            variant="contained"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Processing..." : "Extract Last 2"}
          </Button>
        </DialogActions>
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
