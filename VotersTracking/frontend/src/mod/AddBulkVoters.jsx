import React, { useState, useRef, useEffect } from "react";
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
  const [numProfiles, setNumProfiles] = useState(0);


  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      setIsLoading(true);
      try {
        const worker = await createWorker();
        await worker.loadLanguage("eng");
        await worker.initialize("eng");
        const {
          data: { text },
        } = await worker.recognize(selectedFile);
        setExtractedText(text);
        await worker.terminate();

        const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const image = await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(selectedFile);
      });

      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      const profileWidth = image.width / numProfiles; // Assuming equal width profiles
      const profileHeight = image.height; // Assuming all profiles have same height

      for (let i = 0; i < numProfiles; i++) {
        const profileData = ctx.getImageData(i * profileWidth, 0, profileWidth, profileHeight);
        const newCanvas = document.createElement("canvas");
        newCanvas.width = profileWidth;
        newCanvas.height = profileHeight;
        newCanvas.getContext("2d").putImageData(profileData, 0, 0);

        const profileBlob = await new Promise((resolve, reject) => {
          newCanvas.toBlob(resolve, "image/png");
        });

        const profileURL = URL.createObjectURL(profileBlob);

        // Download the extracted profile image (optional)
        const link = document.createElement("a");
        link.href = profileURL;
        link.download = `profile_${i + 1}.png`;
        link.click();

        URL.revokeObjectURL(profileURL); // Cleanup
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
        <TextField
          label="Number of Profiles"
          type="number"
          InputLabelProps={{ shrink: true }}
          variant="outlined"
          onChange={(e) => setNumProfiles(e.target.value)}
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
          {isLoading ? "Processing..." : "Upload & Extract Text"}
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
