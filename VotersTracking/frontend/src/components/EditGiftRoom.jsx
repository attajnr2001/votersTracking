import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditGiftRoom = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [gift, setGift] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [groupNames, setGroupNames] = useState(["All"]);
  const [selectAll, setSelectAll] = useState(false);
  const { giftId } = useParams();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/dashboard/gift-room");
  };

  // Simulated data - replace this with actual API calls
  useEffect(() => {
    // Fetch gift details
    setGift({ id: giftId, name: "T-Shirt", description: "Campaign T-Shirt" });

    // Fetch members
    const fetchedMembers = [
      {
        id: 1,
        name: "John Doe",
        group: "Group A",
        number: "1234567890",
        gender: "Male",
        age: 30,
        occupation: "Teacher",
        hasReceived: false,
      },
      {
        id: 2,
        name: "Jane Smith",
        group: "Group B",
        number: "0987654321",
        gender: "Female",
        age: 25,
        occupation: "Engineer",
        hasReceived: true,
      },
      {
        id: 3,
        name: "Bob Johnson",
        group: "Group A",
        number: "5555555555",
        gender: "Male",
        age: 40,
        occupation: "Manager",
        hasReceived: false,
      },
      // Add more members as needed
    ];
    setMembers(fetchedMembers);
    setFilteredMembers(fetchedMembers);

    // Extract unique group names
    const uniqueGroups = [
      ...new Set(fetchedMembers.map((member) => member.group)),
    ];
    setGroupNames(["All", ...uniqueGroups]);
  }, [giftId]);

  useEffect(() => {
    const filtered = members.filter((member) => {
      const nameMatch = member.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const genderMatch =
        genderFilter === "All" || member.gender === genderFilter;
      const groupMatch = groupFilter === "All" || member.group === groupFilter;
      return nameMatch && genderMatch && groupMatch;
    });
    setFilteredMembers(filtered);
    setSelectAll(false);
  }, [members, searchTerm, genderFilter, groupFilter]);

  const handleToggleReceived = (memberId) => {
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? { ...member, hasReceived: !member.hasReceived }
          : member
      )
    );
  };

  const handleSelectAll = (event) => {
    const newSelectAll = event.target.checked;
    setSelectAll(newSelectAll);
    setMembers(
      members.map((member) =>
        filteredMembers.some((fm) => fm.id === member.id)
          ? { ...member, hasReceived: newSelectAll }
          : member
      )
    );
  };

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving changes...");
    navigate("/dashboard/gift-room");
  };

  if (!gift) return <Typography>Loading...</Typography>;

  return (
    <Box
      sx={{
        padding: 2,
        minHeight: "100vh",
        background: "linear-gradient(135deg, crimson 0%, #c3cfe2 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <Paper elevation={3} sx={{ padding: 3, marginBottom: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <IconButton onClick={handleBack} sx={{ marginRight: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            color={"secondary"}
            variant="h5"
            sx={{ fontWeight: "bold" }}
            mb={2}
          >
            EDIT GIFT ROOM: {gift.name}
          </Typography>
        </Box>
        <Typography variant="subtitle1" gutterBottom>
          {gift.description}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            label="Search by name"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ width: "100%", marginBottom: 2 }}
          />
          <FormControl sx={{ width: "48%", marginBottom: 2 }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              label="Gender"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: "48%", marginBottom: 2 }}>
            <InputLabel>Group</InputLabel>
            <Select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              label="Group"
            >
              {groupNames.map((group) => (
                <MenuItem key={group} value={group}>
                  {group}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <FormControlLabel
          control={
            <Switch
              checked={selectAll}
              onChange={handleSelectAll}
              color="primary"
            />
          }
          label="Select All Filtered Members"
        />
      </Paper>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Group</TableCell>
              <TableCell>Number</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Occupation</TableCell>
              <TableCell align="center">Received</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredMembers.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.group}</TableCell>
                <TableCell>{member.number}</TableCell>
                <TableCell>{member.gender}</TableCell>
                <TableCell>{member.age}</TableCell>
                <TableCell>{member.occupation}</TableCell>
                <TableCell align="center">
                  <Checkbox
                    checked={member.hasReceived}
                    onChange={() => handleToggleReceived(member.id)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ marginTop: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="contained" color="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  );
};

export default EditGiftRoom;
