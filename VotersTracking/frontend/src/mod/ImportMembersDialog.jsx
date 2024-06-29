import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
} from "@mui/material";
import { createWorker } from "tesseract.js";

const ImportMembersDialog = ({ open, onClose, onImport, isImporting }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Check if the file is an image
    const isImage = file.type.startsWith("image/");
    setIsValidFile(isImage);
  };

  const handleImport = async () => {
    if (selectedFile) {
      setIsProcessing(true);
      const worker = await createWorker("eng");

      try {
        const {
          data: { text },
        } = await worker.recognize(selectedFile);

        // Process the extracted text
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        const members = lines.map((line) => {
          const [name, number, gender, age, occupation] = line
            .split(",")
            .map((item) => item.trim());
          return { name, number, gender, age, occupation };
        });

        onImport(members);
      } catch (error) {
        console.error("Error processing image:", error);
      } finally {
        await worker.terminate();
        setIsProcessing(false);
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
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
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleImport}
          disabled={
            !selectedFile || !isValidFile || isImporting || isProcessing
          }
          color="primary"
        >
          {isProcessing ? (
            <CircularProgress size={24} />
          ) : isImporting ? (
            "Importing..."
          ) : (
            "Import"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImportMembersDialog;
