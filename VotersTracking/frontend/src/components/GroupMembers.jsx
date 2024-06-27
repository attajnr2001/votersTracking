import React, { useState } from "react";
import {
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { motion } from "framer-motion";

const GroupMembers = ({ groupId, onBack }) => {
  // Sample members array
  const [members, setMembers] = useState([
    { id: 1, name: "John Doe", phone: "123-456-7890", address: "123 Main St" },
    { id: 2, name: "Jane Smith", phone: "098-765-4321", address: "456 Elm St" },
    {
      id: 3,
      name: "Bob Johnson",
      phone: "555-555-5555",
      address: "789 Oak St",
    },
  ]);

  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenImportDialog = () => {
    setOpenImportDialog(true);
  };

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImport = () => {
    if (selectedFile) {
      // Here you would implement the logic to parse the CSV or Excel file
      // and add the members to the group
      console.log("Importing file:", selectedFile.name);
      // After importing, you might want to refresh the members list
      // setMembers(newMembersList);
    }
    handleCloseImportDialog();
  };
  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          color={"secondary"}
          fontWeight={"bold"}
          gutterBottom
        >
          GROUP MEMBERS
        </Typography>
        <IconButton color="secondary" onClick={onBack}>
          <ArrowBackIosIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenImportDialog}
        >
          Import Group Members
        </Button>
        <TextField
          label="Search members"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.phone}</TableCell>
                <TableCell>{member.address}</TableCell>
                <TableCell>
                  <Button color="primary" variant="outlined" size="small">
                    <EditIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openImportDialog} onClose={handleCloseImportDialog}>
        <DialogTitle>Import Group Members</DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Select a CSV or Excel file to import group members:
          </Typography>
          <input
            accept=".csv,.xlsx,.xls"
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
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile}
            color="primary"
          >
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GroupMembers;