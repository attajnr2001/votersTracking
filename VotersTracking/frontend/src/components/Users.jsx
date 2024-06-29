import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from "@mui/material";
import {
  useGetUsersQuery,
  useToggleUserStatusMutation,
} from "../slices/usersApiSlice";
import AddUserDialog from "../mod/AddUserDialog";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const Users = () => {
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleToggleStatus = async (userId) => {
    if (userInfo.status === "admin") {
      setOpenSnackbar(true);
      return;
    }

    try {
      await toggleUserStatus(userId).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to toggle user status:", err);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <Typography>Error: {error.message}</Typography>;

  const filteredUsers = users
    ? users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.constituencyName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleExportExcel = () => {
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      filteredUsers.map((user) => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
        Status: user.status,
        Phone: user.phone,
        "Electoral Area": user.constituencyName,
        "Created At": new Date(user.createdAt).toLocaleDateString(),
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "Users List");
    XLSX.writeFile(workBook, "users.xlsx");
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("Users", 20, 10);
    doc.autoTable({
      head: [
        [
          "Name",
          "Email",
          "Role",
          "Status",
          "Phone",
          "Electoral Area",
          "Created At",
        ],
      ],
      body: filteredUsers.map((user) => [
        user.name,
        user.email,
        user.role,
        user.status,
        user.phone,
        user.constituencyName,
        new Date(user.createdAt).toLocaleDateString(),
      ]),
    });
    doc.save("users.pdf");
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          color={"secondary"}
          variant="h5"
          sx={{ fontWeight: "bold" }}
        >
          USERS
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenAddUser(true)}
        >
          Add User
        </Button>
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <TextField
          label="Search by name or constituency"
          variant="outlined"
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Box sx={{ display: "flex", gap: 1 }}>
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

      <TableContainer component={Paper} sx={{ my: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Electoral Area</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.status}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.constituencyName}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color={user.status === "active" ? "secondary" : "primary"}
                    onClick={() => handleToggleStatus(user._id)}
                    disabled={user.role === "super"}
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddUserDialog open={openAddUser} onClose={() => setOpenAddUser(false)} />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          You do not have permission to toggle users status
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Users;
