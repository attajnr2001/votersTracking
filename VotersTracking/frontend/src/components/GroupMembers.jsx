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
  CircularProgress,
  Alert,
  Snackbar,
  TablePagination,
  Select,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  useGetGroupMembersQuery,
  useAddGroupMemberMutation,
  useUpdateGroupMemberMutation,
} from "../slices/groupMembersApiSlice";
import * as XLSX from "xlsx";
import EditMemberDialog from "../mod/EditMemberDialog";
import ImportMembersDialog from "../mod/ImportMembersDialog";

const GroupMembers = ({ groupId, onBack }) => {
  // Sample members array
  const {
    data: groupData,
    isLoading,
    isError,
    refetch,
  } = useGetGroupMembersQuery(groupId);
  const [memberCount, setMemberCount] = useState(0);
  const groupName = groupData && groupData[0]?.group?.name;
  const members = groupData || [];

  const [updateGroupMember] = useUpdateGroupMemberMutation();
  const [addGroupMember, { isLoading: isAdding }] = useAddGroupMemberMutation();
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isValidFile, setIsValidFile] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [genderFilter, setGenderFilter] = useState("All");

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleGenderFilterChange = (event) => {
    setGenderFilter(event.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 20));
    setPage(0);
  };

  const filteredMembers = members
    ? members.filter(
        (member) =>
          (member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.occupation
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          (genderFilter === "All" || member.gender === genderFilter)
      )
    : [];

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

  // Update the member count
  React.useEffect(() => {
    setMemberCount(filteredMembers.length);
  }, [filteredMembers]);

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
  };
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  // In the GroupMembers component

  const handleImport = async (data) => {
    try {
      await addGroupMember(data).unwrap();
      refetch();
      setSnackbarMessage(`Member added successfully`);
      setSnackbarOpen(true);
      handleCloseImportDialog();
    } catch (error) {
      console.error("Failed to add member:", error);
      setSnackbarMessage("Failed to add member");
      setSnackbarOpen(true);
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
            Add
          </Button>
        </Box>

        <Typography variant="body1" color="error" mb={2} fontWeight={"bold"}>
          {memberCount} member{memberCount !== 1 ? "s" : ""}
        </Typography>

        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            label="Search by name or occupation"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Select
            value={genderFilter}
            onChange={handleGenderFilterChange}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="All">All Genders</MenuItem>
            <MenuItem value="M">Male</MenuItem>
            <MenuItem value="F">Female</MenuItem>
          </Select>
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
        <Table aria-label="a dense table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Voter ID</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <TableRow key={member._id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.voterId}</TableCell>
                  <TableCell>{member.number}</TableCell>
                  <TableCell>{member.gender}</TableCell>
                  <TableCell>{member.age}</TableCell>
                  <TableCell>{member.occupation}</TableCell>
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 20, 25]}
        component="div"
        count={filteredMembers.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <ImportMembersDialog
        open={openImportDialog}
        onClose={handleCloseImportDialog}
        onImport={handleImport}
        isImporting={isAdding}
        groupId={groupId}
      />
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
