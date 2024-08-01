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
import Tesseract from "tesseract.js";

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

  const extractVoterData = async (image) => {
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

    const extractPhotoAndData = async (x, y, index) => {
      // Extract photo
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

      // Save photo
      const downloadLink = document.createElement("a");
      downloadLink.href = photoCanvas.toDataURL("image/png");
      downloadLink.download = `voter_${index + 1}_profile.png`;
      downloadLink.click();

      // Extract text data
      const dataCanvas = document.createElement("canvas");
      dataCanvas.width = photoWidth * 2; // Adjust as needed to capture all text
      dataCanvas.height = photoHeight;
      const dataCtx = dataCanvas.getContext("2d");
      dataCtx.drawImage(
        canvas,
        x - photoWidth,
        y,
        photoWidth * 2,
        photoHeight,
        0,
        0,
        photoWidth * 2,
        photoHeight
      );

      // Use Tesseract to extract text
      const {
        data: { text },
      } = await Tesseract.recognize(dataCanvas.toDataURL());

      // Parse the extracted text
      const voterID = text.match(/Voter ID: (\d+)/)?.[1] || "";
      const age = text.match(/Age: (\d+)/)?.[1] || "";
      const sex = text.match(/Sex: (\w+)/)?.[1] || "";
      const name = text.match(/Name: (.+)/)?.[1] || "";

      console.log(`Extracted data for voter ${index + 1}:`, {
        voterID,
        age,
        sex,
        name,
      });

      return { voterID, age, sex, name };
    };

    let voterIndex = 0;
    let y = 0;
    const extractedData = [];

    while (voterIndex < 12 && y + photoHeight <= image.height) {
      const leftData = await extractPhotoAndData(leftColumnX, y, voterIndex);
      extractedData.push({ ...leftData, column: "left", y });
      voterIndex++;

      if (voterIndex < 12) {
        const rightData = await extractPhotoAndData(
          rightColumnX,
          y,
          voterIndex
        );
        extractedData.push({ ...rightData, column: "right", y });
        voterIndex++;
      }

      y += totalRowHeight;
    }

    console.log("Extracted voter data:", extractedData);
    return extractedData;
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const image = await createImageBitmap(selectedFile);
        const extractedData = await extractVoterData(image);

        setSnackbar({
          open: true,
          message: `Successfully extracted data for ${extractedData.length} voters!`,
          severity: "success",
        });

        // Here you could send the extractedData to your backend or process it further
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
