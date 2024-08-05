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
  Box,
  CircularProgress,
  TablePagination,
  Select,
  MenuItem,
  Snackbar,
  TableSortLabel,
  Alert,
} from "@mui/material";
import {
  useGetAllMembersQuery,
  useUpdateGroupMemberMutation,
  useDeleteGroupMemberMutation,
} from "../slices/groupMembersApiSlice";
import EditMemberDialog from "../mod/EditMemberDialog";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const AllMembers = () => {
  const {
    data: members,
    isLoading,
    isError,
    refetch,
  } = useGetAllMembersQuery();
  const [updateGroupMember] = useUpdateGroupMemberMutation();
  const [deleteGroupMember] = useDeleteGroupMemberMutation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleGenderFilterChange = (event) => {
    setGenderFilter(event.target.value);
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

  const handleExportExcel = () => {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      filteredMembers.map((member) => ({
        Name: member.name,
        Group: member.group.name,
        Number: member.number,
        Gender: member.gender,
        Age: member.age,
        Occupation: member.occupation,
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "All Members");
    XLSX.writeFile(workBook, "all_members.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("All Members", 20, 10);
    doc.autoTable({
      head: [["Name", "Group", "Number", "Gender", "Age", "Occupation"]],
      body: filteredMembers.map((member) => [
        member.name,
        member.group.name,
        member.number,
        member.gender,
        member.age,
        member.occupation,
      ]),
    });
    doc.save("all_members.pdf");
  };

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
      await updateGroupMember({
        id: editingMember._id,
        ...updatedMember,
        voterId: updatedMember.voterId || editingMember.voterId, // Ensure voterId is always included
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

  const filteredAndSortedMembers = React.useMemo(() => {
    return filteredMembers.sort((a, b) => {
      if (orderBy === "name") {
        return order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (orderBy === "group") {
        return order === "asc"
          ? a.group.name.localeCompare(b.group.name)
          : b.group.name.localeCompare(a.group.name);
      }
      return 0;
    });
  }, [filteredMembers, order, orderBy]);

  const handleDelete = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      try {
        await deleteGroupMember(memberId).unwrap();
        refetch();
        setSnackbarMessage("Member deleted successfully");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Failed to delete member:", error);
        setSnackbarMessage("Failed to delete member");
        setSnackbarOpen(true);
      }
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography>Error loading members. Please try again.</Typography>;

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h5" color="secondary" fontWeight="bold" gutterBottom>
        ALL MEMBERS
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="body1" color="error" fontWeight="bold">
          {filteredMembers.length} member
          {filteredMembers.length !== 1 ? "s" : ""}
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
        <Table aria-label="all members table" size="small">
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "name"}
                  direction={orderBy === "name" ? order : "asc"}
                  onClick={() => handleRequestSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === "group"}
                  direction={orderBy === "group" ? order : "asc"}
                  onClick={() => handleRequestSort("group")}
                >
                  Group
                </TableSortLabel>
              </TableCell>{" "}
              <TableCell>Voter ID</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedMembers
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((member) => (
                <TableRow key={member._id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.group.name}</TableCell>
                  <TableCell>{member.voterId}</TableCell>
                  <TableCell>{member.number}</TableCell>
                  <TableCell>{member.gender}</TableCell>
                  <TableCell>{member.age}</TableCell>
                  <TableCell>
                    <Button
                      color="primary"
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenEditDialog(member)}
                    >
                      <EditIcon />
                    </Button>
                    <Button
                      color="error"
                      variant="outlined"
                      size="small"
                      onClick={() => handleDelete(member._id)}
                    >
                      <DeleteIcon />
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

export default AllMembers;
