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
