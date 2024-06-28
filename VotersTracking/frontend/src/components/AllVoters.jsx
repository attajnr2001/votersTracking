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
} from "@mui/material";
import {
  useGetVotersQuery,
  useGetConstituenciesQuery,
} from "../slices/votersApiSlice";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const AllVoters = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [filter, setFilter] = useState("");
  const [constituency, setConstituency] = useState("");
  const [currentDateTime, setCurrentDateTime] = useState(null);
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(150);
  const { userInfo } = useSelector((state) => state.auth);

  const handleMinAgeChange = (event) => {
    setMinAge(event.target.value);
  };

  const handleMaxAgeChange = (event) => {
    setMaxAge(event.target.value);
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

  return (
    <Paper>
      <Box p={2}>
        <Typography
          color={"secondary"}
          variant="h5"
          sx={{ fontWeight: "bold" }}
          mb={2}
        >
          ALL VOTERS
        </Typography>
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
          <TableHead>
            <TableRow>
              <TableCell>Avatar</TableCell>
              <TableCell>Surname</TableCell>
              <TableCell>Other Names</TableCell>
              <TableCell>Sex</TableCell>
              <TableCell>PS Code</TableCell>
              <TableCell>Id Number</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Date of Registration</TableCell>
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
