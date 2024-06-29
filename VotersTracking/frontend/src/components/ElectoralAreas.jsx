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
  Snackbar,
  Alert,
  CircularProgress,
  Typography,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SortIcon from "@mui/icons-material/Sort";
import {
  useGetConstituenciesQuery,
  useAddConstituencyMutation,
  useUpdateConstituencyMutation,
  useDeleteConstituencyMutation,
} from "../slices/constituenciesApiSlice";
import AddElectoralArea from "../mod/AddElectoralArea";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const ElectoralAreas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByPopulation, setSortByPopulation] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    psCode: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const {
    data: constituencies,
    isLoading,
    isError,
    error,
  } = useGetConstituenciesQuery();

  const [addConstituency] = useAddConstituencyMutation();
  const [updateConstituency] = useUpdateConstituencyMutation();
  const [deleteConstituency] = useDeleteConstituencyMutation();

  const handleSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddArea = () => {
    setFormData({ name: "", psCode: "" });
    setEditingId(null);
    setOpenDialog(true);
  };

  const handleEdit = (id) => {
    const areaToEdit = constituencies.find((area) => area._id === id);
    setFormData({
      _id: areaToEdit._id,
      name: areaToEdit.name,
      psCode: areaToEdit.psCode,
    });
    setEditingId(id);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteConstituency(id).unwrap();
      handleSnackbar("Constituency deleted successfully");
    } catch (err) {
      handleSnackbar("Failed to delete constituency", "error");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", psCode: "" });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateConstituency(formData).unwrap();
        handleSnackbar("Constituency updated successfully");
      } else {
        await addConstituency(formData).unwrap();
        handleSnackbar("Constituency added successfully");
      }
      handleCloseDialog();
    } catch (err) {
      handleSnackbar("Failed to save constituency", "error");
    }
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

  if (isLoading) return <CircularProgress />;
  if (isError) return <div>Error: {error.message}</div>;

  const handleExportExcel = () => {
    console.log("excel printing");
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      filteredAndSortedConstituencies.map((row) => ({
        Name: row.name,
        "PS Code": row.psCode,
        Phone: row.coordinatorPhone,
        Population: row.population,
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "Electoral Areas List");
    XLSX.writeFile(workBook, "electoral_areas.xlsx");
  };

  const handleExportPDF = () => {
    console.log("pdf printing");

    const doc = new jsPDF();
    doc.text("Electoral Areas", 20, 10);
    doc.autoTable({
      head: [["Name", "PS Code", "Phone", "Population"]],
      body: filteredAndSortedConstituencies.map((row) => [
        row.name,
        row.psCode,
        row.coordinatorPhone,
        row.population,
      ]),
    });
    doc.save("electoral_areas.pdf");
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography
          color={"secondary"}
          variant="h5"
          sx={{ fontWeight: "bold" }}
          mb={2}
        >
          ELECTORAL AREAS
        </Typography>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
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

      <AddElectoralArea
        open={openDialog}
        onClose={handleCloseDialog}
        formData={formData}
        editingId={editingId}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ElectoralAreas;
