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
  } = useGetConstituenciesQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const handleAddArea = () => {
    console.log("Add new electoral area");
  };

  const handleEdit = (id) => {
    console.log("Edit area with id:", id);
  };

  const handleDelete = (id) => {
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
              <TableCell>Phone</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {constituencies.map((constituency) => (
              <TableRow key={constituency._id}>
                <TableCell>{constituency.name}</TableCell>
                <TableCell>{constituency.psCode}</TableCell>
                <TableCell>{constituency.coordinatorPhone}</TableCell>
                <TableCell>{constituency.population}</TableCell>
                <TableCell>
                  <Button
                    sx={{ mr: 1 }}
                    size="small"
                    variant="outlined"
                    onClick={() => handleEdit(constituency._id)}
                    color="primary"
                  >
                    <EditIcon />
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => handleDelete(constituency._id)}
                    color="error"
                  >
                    <DeleteIcon />
                  </Button>
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
