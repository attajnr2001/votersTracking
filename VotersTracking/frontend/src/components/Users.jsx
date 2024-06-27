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
  IconButton,
  Alert,
} from "@mui/material";
import {
  useGetUsersQuery,
  useToggleUserStatusMutation,
} from "../slices/usersApiSlice";
import AddUserDialog from "../mod/AddUserDialog";
import { useSelector } from "react-redux";

const Users = () => {
  const [openAddUser, setOpenAddUser] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { data: users, isLoading, error, refetch } = useGetUsersQuery();
  const [toggleUserStatus] = useToggleUserStatusMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const handleToggleStatus = async (userId) => {
    if (userInfo.role !== "super") {
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

  if (isLoading) return <Typography>Loading...</Typography>;
  if (error) return <Typography>Error: {error.message}</Typography>;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Constituency</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
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
