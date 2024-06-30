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

const ImportMembersDialog = ({ open, onClose, onImport, isImporting }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState("");

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Check if the file is an image
    const isImage = file.type.startsWith("image/");
    setIsValidFile(isImage);
  };

  const handleExtractText = async () => {
    if (selectedFile) {
      setIsProcessing(true);
      const worker = await createWorker("eng");

      try {
        const {
          data: { text },
        } = await worker.recognize(selectedFile);
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
          onChange={handleFileChange}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Choose File
          </Button>
        </label>
        {selectedFile && (
          <Typography variant="body2" mt={1}>
            Selected file: {selectedFile.name}
          </Typography>
        )}
        {selectedFile && !isValidFile && (
          <Typography variant="body2" color="error" mt={1}>
            Please select a valid image file
          </Typography>
        )} <br />
        <Button
          onClick={handleExtractText}
          disabled={!selectedFile || !isValidFile || isProcessing}
          color="primary"
          variant="contained"
          sx={{ mt: 2 }}
        >
          {isProcessing ? <CircularProgress size={24} /> : "Extract Text"}
        </Button>
        {extractedText && (
          <TextField
            label="Extracted Text"
            multiline
            rows={10}
            value={extractedText}
            fullWidth
            variant="outlined"
            sx={{ mt: 2 }}
            InputProps={{
              readOnly: true,
            }}
          />
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportMembersDialog;
