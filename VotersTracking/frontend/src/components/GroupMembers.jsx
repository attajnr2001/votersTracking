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
import {
  useGetGroupMembersQuery,
  useImportGroupMembersMutation,
  useUpdateGroupMemberMutation,
} from "../slices/groupMembersApiSlice";
import * as XLSX from "xlsx";
import EditMemberDialog from "../mod/EditMemberDialog";

const GroupMembers = ({ groupId, onBack }) => {
  // Sample members array
  const {
    data: members,
    isLoading,
    isError,
    refetch,
  } = useGetGroupMembersQuery(groupId);
  const [importGroupMembers, { isLoading: isImporting }] =
    useImportGroupMembersMutation();
  const [updateGroupMember] = useUpdateGroupMemberMutation();

  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleOpenEditDialog = (member) => {
    setEditingMember(member);
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditingMember(null);
    setEditDialogOpen(false);
  };

  const handleEditSubmit = async (updatedMember) => {
    try {
      await updateGroupMember(updatedMember).unwrap();
      handleCloseEditDialog();
      refetch();
    } catch (error) {
      console.error("Failed to update member:", error);
      // Handle error (e.g., show an error message)
    }
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
    return <Typography>Loading members...</Typography>;
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
          label="Search by name or occupation"
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
                  <Button
                    color="primary"
                    variant="outlined"
                    size="small"
                    onClick={handleOpenEditDialog}
                  >
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
    </Box>
  );
};

export default GroupMembers;
