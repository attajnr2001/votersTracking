import React, { useState } from "react";
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

const ElectoralAreas = () => {
  // Sample data - replace this with your actual data source
  const [electoralAreas, setElectoralAreas] = useState([
    {
      id: 1,
      name: "Area 1",
      psCode: "PS001",
      coordinator: "John Doe",
      phone: "123-456-7890",
      population: 143,
    },
    {
      id: 2,
      name: "Area 2",
      psCode: "PS002",
      coordinator: "Jane Smith",
      phone: "098-765-4321",
      population: 101,
    },
  ]);

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
              <TableCell>Current Coordinator</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Population</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {electoralAreas.map((area) => (
              <TableRow key={area.id}>
                <TableCell>{area.name}</TableCell>
                <TableCell>{area.psCode}</TableCell>
                <TableCell>{area.coordinator}</TableCell>
                <TableCell>{area.phone}</TableCell>
                <TableCell>{area.population}</TableCell>
                <TableCell>
                  <IconButton
                    onClick={() => handleEdit(area.id)}
                    color="primary"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    onClick={() => handleDelete(area.id)}
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
