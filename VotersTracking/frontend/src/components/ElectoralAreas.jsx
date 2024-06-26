import React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useGetConstituenciesQuery } from "../slices/constituenciesApiSlice";

const ElectoralAreas = () => {
  const {
    data: constituencies,
    isLoading,
    isError,
    error,
  } = useGetConstituenciesQuery();

  const handleAddArea = () => {
    // Implement the logic to add a new electoral area
    console.log("Add new electoral area");
  };

  const handleEdit = (id) => {
    // Implement the logic to edit an electoral area
    console.log("Edit area with id:", id);
  };

  const handleDelete = (id) => {
    // Implement the logic to delete an electoral area
    console.log("Delete area with id:", id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddArea}
        sx={{ mb: 2 }}
      >
        Add Electoral Area
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>PS Code</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {constituencies.map((constituency) => (
              <TableRow key={constituency._id}>
                <TableCell>{constituency.name}</TableCell>
                <TableCell>{constituency.psCode}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(constituency._id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(constituency._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ElectoralAreas;
