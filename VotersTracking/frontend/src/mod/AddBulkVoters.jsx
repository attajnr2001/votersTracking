import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
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
  Snackbar,
  Alert,
} from "@mui/material";

const AddBulkVoters = ({ open, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
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

  const uploadImageToFirebase = async (blob) => {
    if (!blob) return null;
    const fileRef = ref(storage, `voter_images/${uuidv4()}`);
    await uploadBytes(fileRef, blob);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        // Text extraction
        const worker = await createWorker();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(selectedFile);
        setExtractedText(text);
        await worker.terminate();

        // Image processing
        const image = await createImageBitmap(selectedFile);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // Extract profile pictures
        const profileWidth = 70;
        const profileHeight = 70;
        const numProfiles = Math.floor(image.height / profileHeight);

        for (let i = 0; i < numProfiles; i++) {
          const profileData = ctx.getImageData(
            image.width - profileWidth,
            i * profileHeight,
            profileWidth,
            profileHeight
          );

          const profileCanvas = document.createElement("canvas");
          profileCanvas.width = profileWidth;
          profileCanvas.height = profileHeight;
          profileCanvas.getContext("2d").putImageData(profileData, 0, 0);

          const profileBlob = await new Promise((resolve) =>
            profileCanvas.toBlob(resolve, "image/png")
          );
          // Upload the extracted profile image to Firebase
          const downloadURL = await uploadImageToFirebase(profileBlob);
          console.log(`Profile ${i + 1} uploaded. URL:`, downloadURL);

          // You can store these URLs in state or process them further as needed

          setSnackbar({
            open: true,
            message: "Image processed and profiles uploaded successfully!",
            severity: "success",
          });
        }
      } catch (error) {
        console.error("Error processing image:", error);
        // Show error message
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
        <DialogTitle>Upload Image File (JPEG or PNG)</DialogTitle>
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
            {isLoading ? "Processing..." : "Upload & Extract"}
          </Button>
        </DialogActions>

        {extractedText && (
          <DialogContent>
            <TextField
              label="Extracted Text"
              multiline
              rows={6}
              variant="outlined"
              fullWidth
              value={extractedText}
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
