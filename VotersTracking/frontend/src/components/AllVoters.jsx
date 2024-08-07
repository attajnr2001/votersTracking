import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Avatar,
  TextField,
  MenuItem,
  Box,
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  useGetVotersQuery,
  useGetConstituenciesQuery,
  useUpdateVoterMutation,
} from "../slices/votersApiSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import EditIcon from "@mui/icons-material/Edit";

const AllVoters = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [constituency, setConstituency] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(120);
  const { userInfo } = useSelector((state) => state.auth);
  const [filteredCount, setFilteredCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const [editingVoter, setEditingVoter] = useState(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [updateVoter] = useUpdateVoterMutation();

  const handleOpenEditDialog = (voter) => {
    setEditingVoter(voter);
    setOpenEditDialog(true);
  };

  const handleCloseEditDialog = () => {
    setEditingVoter(null);
    setOpenEditDialog(false);
  };

  const handleEditSubmit = async () => {
    try {
      await updateVoter(editingVoter).unwrap();
      handleCloseEditDialog();
      setSnackbarMessage("Voter updated successfully");
      setSnackbarOpen(true);
      refetch(); // Use the refetch function here
    } catch (error) {
      console.error("Failed to update voter:", error);
      setSnackbarMessage("Failed to update voter");
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    console.log(searchTerm);
  };

  const handleMinAgeChange = (event) => {
    const newMinAge = Math.max(
      18,
      Math.min(150, parseInt(event.target.value, 10) || 18)
    );
    setMinAge(newMinAge);
    if (newMinAge > maxAge) {
      setMaxAge(newMinAge);
    }
  };

  const handleMaxAgeChange = (event) => {
    const newMaxAge = Math.max(
      18,
      Math.min(150, parseInt(event.target.value, 10) || 150)
    );
    setMaxAge(newMaxAge);
    if (newMaxAge < minAge) {
      setMinAge(newMaxAge);
    }
  };

  const {
    data: voters,
    error: votersError,
    isLoading: isLoadingVoters,
    refetch,
  } = useGetVotersQuery(userInfo.psCode);

  const {
    data: constituencies,
    error: constituenciesError,
    isLoading: isLoadingConstituencies,
  } = useGetConstituenciesQuery();

  useEffect(() => {
    const fetchCurrentTime = async () => {
      try {
        const response = await axios.get(
          "https://worldtimeapi.org/api/timezone/Africa/Accra"
        );
        setCurrentDateTime(new Date(response.data.datetime));
      } catch (error) {
        console.error("Error fetching current time:", error);
        setCurrentDateTime(new Date());
      }
    };

    fetchCurrentTime();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleConstituencyChange = (event) => {
    setConstituency(event.target.value);
  };

  const filteredRows = React.useMemo(() => {
    return voters
      ? voters
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .filter((row) => {
            // Search filter
            if (searchTerm && searchTerm !== "") {
              const searchLower = searchTerm.toLowerCase();
              if (
                !row.surname.toLowerCase().includes(searchLower) &&
                !row.otherNames.toLowerCase().includes(searchLower) &&
                !row.idNumber.toLowerCase().includes(searchLower)
              ) {
                return false;
              }
            }
            // Constituency filter
            if (constituency && constituency !== "") {
              if (row.psCode !== constituency) {
                return false;
              }
            }

            // Gender filter
            if (filter === "Males" && row.sex !== "M") {
              return false;
            }
            if (filter === "Females" && row.sex !== "F") {
              return false;
            }

            // Age filter
            if (row.age < minAge || row.age > maxAge) {
              return false;
            }

            return true;
          })
      : [];
  }, [voters, constituency, filter, minAge, maxAge, searchTerm]);

  // Update the filtered count
  useEffect(() => {
    setFilteredCount(filteredRows.length);
  }, [filteredRows]);
  if (isLoadingVoters || isLoadingConstituencies || !currentDateTime) {
    return <CircularProgress />;
  }

  if (votersError || constituenciesError) {
    return <Typography color="error">Error loading data</Typography>;
  }

  const handleExportExcel = () => {
    console.log("excel printing");
    const workBook = XLSX.utils.book_new();
    const workSheet = XLSX.utils.json_to_sheet(
      filteredRows.map((row) => ({
        Surname: row.surname,
        "Other Names": row.otherNames,
        Sex: row.sex,
        "PS Code": row.psCode,
        "ID Number": row.idNumber,
        Age: row.age,
        "Date of Registration": new Date(row.dor).toLocaleDateString(),
      }))
    );

    XLSX.utils.book_append_sheet(workBook, workSheet, "Voters List");
    XLSX.writeFile(workBook, "voters.xlsx");
  };

  const handleExportPDF = () => {
    console.log("pdf printing");

    const doc = new jsPDF();
    doc.text("Voters Table", 20, 10);
    doc.autoTable({
      head: [
        [
          "Surname",
          "Other Names",
          "Sex",
          "PS Code",
          "ID Number",
          "Date of Birth",
          "Age",
          "Date of Reg",
        ],
      ],
      body: filteredRows.map((row) => [
        row.surname,
        row.otherNames,
        row.sex,
        row.psCode,
        row.idNumber,
        row.age,
        new Date(row.dor).toLocaleDateString(),
      ]),
    });
    doc.save("voters.pdf");
  };

  return (
    <Paper>
      <Box p={2}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            color={"secondary"}
            variant="h5"
            sx={{ fontWeight: "bold" }}
            mb={2}
          >
            ALL VOTERS
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

        <Box my={2}>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
            variant="outlined"
            fullWidth
            placeholder="Search by surname, other names, or ID number"
          />
        </Box>

        <Box display="flex" gap={2} marginBottom={2}>
          {userInfo.psCode === "all" && (
            <TextField
              select
              label="Electoral Area"
              value={constituency}
              onChange={handleConstituencyChange}
              variant="outlined"
              fullWidth
            >
              <MenuItem value="">All</MenuItem>
              {constituencies &&
                constituencies.map((constituencyItem) => (
                  <MenuItem
                    key={constituencyItem.psCode}
                    value={constituencyItem.psCode}
                  >
                    {constituencyItem.name}
                  </MenuItem>
                ))}
            </TextField>
          )}
          <TextField
            select
            label="Filter"
            value={filter}
            onChange={handleFilterChange}
            variant="outlined"
            fullWidth
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="Males">Males</MenuItem>
            <MenuItem value="Females">Females</MenuItem>
          </TextField>

          <TextField
            label="Min Age"
            type="number"
            value={minAge}
            onChange={handleMinAgeChange}
            variant="outlined"
            fullWidth
            InputProps={{ inputProps: { min: 18, max: 150 } }}
          />
          <TextField
            label="Max Age"
            type="number"
            value={maxAge}
            onChange={handleMaxAgeChange}
            variant="outlined"
            fullWidth
            InputProps={{ inputProps: { min: 18, max: 150 } }}
          />
        </Box>
      </Box>

      <Typography variant="body1" color="error" mb={2} fontWeight={"bold"}>
        Voter's Count: {filteredCount} voter{filteredCount !== 1 ? "s" : ""}
        {constituency ? ` in ${constituency}` : ""}
        {filter ? ` (${filter})` : ""}
        {` [${minAge} and ${maxAge}]`}
        {searchTerm ? ` matching "${searchTerm}"` : ""}
      </Typography>

      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Image</TableCell>
              <TableCell sx={{ color: "white" }}>Surname</TableCell>
              <TableCell sx={{ color: "white" }}>Other Names</TableCell>
              <TableCell sx={{ color: "white" }}>Sex</TableCell>
              <TableCell sx={{ color: "white" }}>PS Code</TableCell>
              <TableCell sx={{ color: "white" }}>Id Number</TableCell>
              <TableCell sx={{ color: "white" }}>Age</TableCell>
              <TableCell sx={{ color: "white" }}>Date of Reg.</TableCell>
              <TableCell sx={{ color: "white" }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <AnimatePresence mode="wait">
              {filteredRows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <motion.tr
                    key={row._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.1 }}
                  >
                    <TableCell>
                      <Avatar src={row.image} />
                    </TableCell>
                    <TableCell>{row.surname}</TableCell>
                    <TableCell>{row.otherNames}</TableCell>
                    <TableCell>{row.sex}</TableCell>
                    <TableCell>{row.psCode}</TableCell>
                    <TableCell>{row.idNumber}</TableCell>
                    <TableCell>{row.age}</TableCell>
                    <TableCell>
                      {new Date(row.dor).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        startIcon={<EditIcon />}
                        variant="contained"
                        onClick={() => handleOpenEditDialog(row)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={filteredRows.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      <Dialog open={openEditDialog} onClose={handleCloseEditDialog}>
        <DialogTitle>Edit Voter</DialogTitle>
        <DialogContent>
          {editingVoter && (
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}
            >
              <TextField
                label="Surname"
                value={editingVoter.surname}
                onChange={(e) =>
                  setEditingVoter({ ...editingVoter, surname: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="Other Names"
                value={editingVoter.otherNames}
                onChange={(e) =>
                  setEditingVoter({
                    ...editingVoter,
                    otherNames: e.target.value,
                  })
                }
                fullWidth
              />
              <TextField
                label="Age"
                type="number"
                value={editingVoter.age}
                onChange={(e) =>
                  setEditingVoter({
                    ...editingVoter,
                    age: parseInt(e.target.value),
                  })
                }
                fullWidth
              />
              <TextField
                select
                label="Sex"
                value={editingVoter.sex}
                onChange={(e) =>
                  setEditingVoter({ ...editingVoter, sex: e.target.value })
                }
                fullWidth
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </TextField>
              <TextField
                label="PS Code"
                value={editingVoter.psCode}
                onChange={(e) =>
                  setEditingVoter({ ...editingVoter, psCode: e.target.value })
                }
                fullWidth
              />
              <TextField
                label="ID Number"
                value={editingVoter.idNumber}
                onChange={(e) =>
                  setEditingVoter({ ...editingVoter, idNumber: e.target.value })
                }
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditDialog}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

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
    </Paper>
  );
};

export default AllVoters;
