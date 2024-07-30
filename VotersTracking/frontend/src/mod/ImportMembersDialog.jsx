import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  TextField,
} from "@mui/material";
import { createWorker } from "tesseract.js";

const ImportMembersDialog = ({
  open,
  onClose,
  onImport,
  isImporting,
  groupId,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedImage(file);
    } else {
      setSelectedImage(null);
      alert("Please select a valid image file.");
    }
  };

  const handleImport = async () => {
    if (extractedText) {
      const members = parseExtractedText(extractedText);
      try {
        await onImport({ members, groupId });
        onClose();
        // Success message will be handled in the parent component
      } catch (error) {
        console.error("Error importing members:", error);
        // Error message will be handled in the parent component
      }
    }
  };

  const handleExtractText = async () => {
    if (selectedImage) {
      setIsProcessing(true);
      const worker = await createWorker("eng");

      try {
        const {
          data: { text },
        } = await worker.recognize(selectedImage);
        setExtractedText(text);
      } catch (error) {
        console.error("Error processing image:", error);
        setExtractedText("Error extracting text from the image.");
      } finally {
        await worker.terminate();
        setIsProcessing(false);
      }
    }
  };

  const handleCleanText = () => {
    const cleanedText = extractedText.replace(/[^a-zA-Z0-9\s.]/g, "");
    setExtractedText(cleanedText);
  };

  const parseExtractedText = (text) => {
    const lines = text.split("\n");
    return lines
      .map((line) => {
        const parts = line.split(/(?<=\D)\s+(?=\d)/);
        if (parts.length >= 2) {
          const name = parts[0].trim();
          const number = parts[1].trim();
          return {
            name,
            number,
            gender: "",
            age: "",
            occupation: "",
          };
        } else {
          console.warn(`Skipping invalid line: ${line}`);
          return null;
        }
      })
      .filter((member) => member !== null);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Import Group Members</DialogTitle>
      <DialogContent>
        <Typography variant="body1" gutterBottom>
          Select an image file containing member information:
        </Typography>
        <input
          accept="image/*"
          style={{ display: "none" }}
          id="raised-button-file"
          type="file"
          onChange={handleImageChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Choose Image
          </Button>
        </label>
        {selectedImage && (
          <Typography variant="body2" mt={1}>
            Selected image: {selectedImage.name}
          </Typography>
        )}
        <br />
        <Button
          onClick={handleExtractText}
          disabled={!selectedImage || isProcessing}
          color="primary"
          variant="contained"
          sx={{ mt: 2 }}
        >
          {isProcessing ? <CircularProgress size={24} /> : "Extract Text"}
        </Button>
        {extractedText && (
          <>
            <Button
              onClick={handleCleanText}
              color="secondary"
              variant="contained"
              sx={{ mt: 2, ml: 2 }}
            >
              Clean Text
            </Button>
            <TextField
              label="Extracted Text"
              multiline
              rows={10}
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleImport}
          color="primary"
          disabled={!extractedText || isImporting}
        >
          {isImporting ? <CircularProgress size={24} /> : "Import"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportMembersDialog;
