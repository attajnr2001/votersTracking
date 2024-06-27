import React, { useState, useMemo } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import { useGetConstituenciesQuery } from "../slices/constituenciesApiSlice";

const ElectoralAreas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByPopulation, setSortByPopulation] = useState(false);

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

  const handleSearch = () => {
    // The search is already handled in the filteredAndSortedConstituencies useMemo
    console.log("Searching for:", searchTerm);
  };

  const toggleSort = () => {
    setSortByPopulation(!sortByPopulation);
  };

  const filteredAndSortedConstituencies = useMemo(() => {
    if (!constituencies) return [];

    let filtered = constituencies.filter((constituency) =>
      constituency.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortByPopulation) {
      filtered.sort((a, b) => b.population - a.population);
    }

    return filtered;
  }, [constituencies, searchTerm, sortByPopulation]);

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ p: 3 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Box display="flex" alignItems="center">
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <IconButton
            onClick={toggleSort}
            color={sortByPopulation ? "primary" : "default"}
          >
            <SortIcon />
          </IconButton>
        </Box>
        <Button variant="contained" color="primary" onClick={handleAddArea}>
          Add Electoral Area
        </Button>
      </Box>

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
            {filteredAndSortedConstituencies.map((constituency) => (
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
