import React, { useState } from "react";
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
} from "@mui/material";
import { useGetUsersQuery } from "../slices/usersApiSlice";
import AddUserDialog from "../mod/AddUserDialog";

const Users = () => {
  const [openAddUser, setOpenAddUser] = useState(false);
  const { data: users, isLoading, error } = useGetUsersQuery();

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
              <TableCell>Created At</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <AddUserDialog open={openAddUser} onClose={() => setOpenAddUser(false)} />
    </Box>
  );
};

export default Users;
