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

  const extractPhotos = async (image) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = image.width;
    canvas.height = image.height;
    ctx.drawImage(image, 0, 0);

    const cmToPixels = (cm) => Math.round((cm / 21.6) * image.height);

    const photoWidth = cmToPixels(2.4);
    const photoHeight = cmToPixels(3.41);
    const rowSpacing = cmToPixels(0.2);
    const totalRowHeight = photoHeight + rowSpacing;

    const leftColumnX = cmToPixels(6);
    const rightColumnX = cmToPixels(15.1);

    console.log(`Image dimensions: ${image.width}x${image.height}`);
    console.log(`Photo dimensions: ${photoWidth}x${photoHeight}`);
    console.log(`Row spacing: ${rowSpacing}`);
    console.log(`Total row height: ${totalRowHeight}`);

    const extractPhoto = (x, y, index) => {
      const photoCanvas = document.createElement("canvas");
      photoCanvas.width = photoWidth;
      photoCanvas.height = photoHeight;
      const photoCtx = photoCanvas.getContext("2d");
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

      console.log(`Extracted photo ${index + 1} at (${x}, ${y})`);
      return true;
    };

    let photoIndex = 0;
    let y = 0;
    const extractedPhotos = [];

    while (photoIndex < 12) {
      if (extractPhoto(leftColumnX, y, photoIndex)) {
        extractedPhotos.push({ index: photoIndex, column: "left", y });
        photoIndex++;
      }

      if (photoIndex < 12 && extractPhoto(rightColumnX, y, photoIndex)) {
        extractedPhotos.push({ index: photoIndex, column: "right", y });
        photoIndex++;
      }

      y += totalRowHeight;

      if (y + photoHeight > image.height && photoIndex < 12) {
        console.log(
          `Warning: Reached end of image before extracting all 12 photos. Extracted ${photoIndex} photos.`
        );
        break;
      }
    }

    console.log("Extracted photos:", extractedPhotos);
    return extractedPhotos.length;
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const image = await createImageBitmap(selectedFile);
        const extractedCount = await extractPhotos(image);

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
            onClick={handleUpload}
            color="primary"
            variant="contained"
            disabled={!selectedFile || isLoading}
          >
            {isLoading ? "Processing..." : "Extract Last Row Photos"}
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
