import React, { useState, useRef } from "react";
import { createWorker } from "tesseract.js";
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
  const [extractedText, setExtractedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
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

          // Download the extracted profile image
          const link = document.createElement("a");
          link.href = URL.createObjectURL(profileBlob);
          link.download = `profile_${i + 1}.png`;
          link.click();
          URL.revokeObjectURL(link.href);
        }
      } catch (error) {
        console.error("Error processing image:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
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
  );
};

export default AddBulkVoters;
