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
} from "@mui/material";
import {
  useGetVotersQuery,
  useGetConstituenciesQuery,
} from "../slices/votersApiSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";

const AllVoters = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [constituency, setConstituency] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(100);
  const { userInfo } = useSelector((state) => state.auth);

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

  const getAge = (dob) => {
    const birthDate = new Date(dob);
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

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

  const filteredRows = voters
    ? voters
        .slice()
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .filter((row) => {
          let matchesFilter = true;
          let matchesConstituency = true;
          let matchesAgeRange = true;
          let matchesPsCode =
            userInfo.psCode === "all" || row.psCode === userInfo.psCode;

          if (filter === "Males") matchesFilter = row.sex === "M";
          if (filter === "Females") matchesFilter = row.sex === "F";
          if (filter === "Below 40") matchesFilter = getAge(row.dob) < 40;
          if (filter === "Above 40") matchesFilter = getAge(row.dob) >= 40;

          if (userInfo.psCode === "all" && constituency) {
            matchesConstituency = row.psCode === constituency;
          }

          const age = getAge(row.dob);
          if (minAge && maxAge) {
            matchesAgeRange =
              age >= parseInt(minAge) && age <= parseInt(maxAge);
          } else if (minAge) {
            matchesAgeRange = age >= parseInt(minAge);
          } else if (maxAge) {
            matchesAgeRange = age <= parseInt(maxAge);
          }

          return (
            matchesFilter &&
            matchesConstituency &&
            matchesAgeRange &&
            matchesPsCode
          );
        })
    : [];

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
        "Date of Birth": new Date(row.dob).toLocaleDateString(),
        Age: getAge(row.dob),
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
        new Date(row.dob).toLocaleDateString(),
        getAge(row.dob),
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
                constituencies.map((constituency) => (
                  <MenuItem
                    key={constituency.psCode}
                    value={constituency.psCode}
                  >
                    {constituency.name}
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
            <MenuItem value="Below 40">Below 40</MenuItem>
            <MenuItem value="Above 40">Above 40</MenuItem>
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
      <TableContainer>
        <Table>
          <TableHead sx={{ backgroundColor: "primary.main" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Avatar</TableCell>
              <TableCell sx={{ color: "white" }}>Surname</TableCell>
              <TableCell sx={{ color: "white" }}>Other Names</TableCell>
              <TableCell sx={{ color: "white" }}>Sex</TableCell>
              <TableCell sx={{ color: "white" }}>PS Code</TableCell>
              <TableCell sx={{ color: "white" }}>Id Number</TableCell>
              <TableCell sx={{ color: "white" }}>Date of Birth</TableCell>
              <TableCell sx={{ color: "white" }}>Age</TableCell>
              <TableCell sx={{ color: "white" }}>
                Date of Registration
              </TableCell>
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
                    <TableCell>
                      {new Date(row.dob).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{getAge(row.dob)}</TableCell>
                    <TableCell>
                      {new Date(row.dor).toLocaleDateString()}
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
    </Paper>
  );
};

export default AllVoters;
