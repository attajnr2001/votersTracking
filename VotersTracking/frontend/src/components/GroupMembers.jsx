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
  Snackbar,
  CircularProgress,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  useGetGroupMembersQuery,
  useImportGroupMembersMutation,
  useUpdateGroupMemberMutation,
} from "../slices/groupMembersApiSlice";
import * as XLSX from "xlsx";
import EditMemberDialog from "../mod/EditMemberDialog";
import { useGetGroupByIdQuery } from "../slices/groupsApiSlice";

const GroupMembers = ({ groupId, onBack }) => {
  // Sample members array
  const {
    data: groupData,
    isLoading,
    isError,
    refetch,
  } = useGetGroupMembersQuery(groupId);

  const groupName = groupData && groupData[0]?.group?.name;
  const members = groupData || [];

  const [importGroupMembers, { isLoading: isImporting }] =
    useImportGroupMembersMutation();
  const [updateGroupMember] = useUpdateGroupMemberMutation();

  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpenEditDialog = (member) => {
    if (member) {
      setEditingMember(member);
      setEditDialogOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setEditingMember(null);
    setEditDialogOpen(false);
  };

  const handleEditSubmit = async (updatedMember) => {
    try {
      await updateGroupMember({
        id: editingMember._id,
        ...updatedMember,
      }).unwrap();
      handleCloseEditDialog();
      refetch();
      setSnackbarMessage("Member updated successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Failed to update member:", error);
      setSnackbarMessage("Failed to update member");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMembers = members
    ? members.filter(
        (member) =>
          member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.occupation.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography>Error loading members. Please try again.</Typography>;
  }

  const handleOpenImportDialog = () => {
    setOpenImportDialog(true);
  };

  const handleCloseImportDialog = () => {
    setOpenImportDialog(false);
    setSelectedFile(null);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);

    // Check if the file is an Excel file
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls");
    setIsValidFile(isExcel);
  };

  const handleImport = async () => {
    if (selectedFile) {
      // Read the file contents
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Assume the first sheet is the one we want
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        console.log(
          "Extracted data from Excel:",
          JSON.stringify(jsonData, null, 2)
        );

        try {
          const result = await importGroupMembers({
            members: jsonData,
            groupId,
          }).unwrap();
          console.log("Import successful:", result);
          handleCloseImportDialog();
        } catch (error) {
          console.error("Import failed:", error);
          // Handle the error (e.g., show an error message to the user)
        }
      };

      reader.readAsArrayBuffer(selectedFile);
    }

    if (result) {
      refetch();
    }
  };

  const handleExportExcel = () => {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      filteredMembers.map((member) => ({
        Name: member.name,
        Number: member.number,
        Gender: member.gender,
        Age: member.age,
        Occupation: member.occupation,
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "Group Members List");
    XLSX.writeFile(workBook, "group_members.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Group Members", 20, 10);
    doc.autoTable({
      head: [["Name", "Number", "Gender", "Age", "Occupation"]],
      body: filteredMembers.map((member) => [
        member.name,
        member.number,
        member.gender,
        member.age,
        member.occupation,
      ]),
    });
    doc.save("group_members.pdf");
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
          color="secondary"
          fontWeight="bold"
          gutterBottom
        >
          {groupName ? `${groupName}` : "GROUP MEMBERS"}
        </Typography>
        <IconButton color="secondary" onClick={onBack}>
          <ArrowBackIosIcon />
        </IconButton>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleOpenImportDialog}
          >
            Import Group Members
          </Button>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Search by name or occupation"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleExportExcel}
          >
            Excel
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={handleExportPDF}
          >
            PDF
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member._id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.number}</TableCell>
                <TableCell>{member.gender}</TableCell>
                <TableCell>{member.age}</TableCell>
                <TableCell>{member.occupation}</TableCell>
                <TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenEditDialog(member)}
                    >
                      <EditIcon />
                    </Button>
                  </TableCell>
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
            Select a Excel file to import group members:
          </Typography>
          <input
            accept=".xlsx,.xls"
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
              Please select a valid Excel file (.xlsx or .xls)
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseImportDialog}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={!selectedFile || !isValidFile || isImporting}
            color="primary"
          >
            {isImporting ? "Importing..." : "Import"}
          </Button>
        </DialogActions>
      </Dialog>

      <EditMemberDialog
        open={editDialogOpen}
        onClose={handleCloseEditDialog}
        member={editingMember}
        onSubmit={handleEditSubmit}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default GroupMembers;
