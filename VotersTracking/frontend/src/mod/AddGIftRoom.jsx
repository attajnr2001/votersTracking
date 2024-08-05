import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  CircularProgress,
  Typography,
} from "@mui/material";
import { useGetAllMembersQuery } from "../slices/groupMembersApiSlice";

const AddGiftRoom = () => {
  const navigate = useNavigate();
  const [newGift, setNewGift] = useState({ name: "", description: "" });
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [groupFilter, setGroupFilter] = useState("All");
  const [groupNames, setGroupNames] = useState(["All"]);
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const { data: members, isLoading, isError } = useGetAllMembersQuery();

  useEffect(() => {
    if (members) {
      const uniqueGroups = [
        ...new Set(members.map((member) => member.group.name)),
      ];
      setGroupNames(["All", ...uniqueGroups]);
    }
  }, [members]);

  useEffect(() => {
    if (members) {
      setIsFiltering(true);
      const filtered = members.filter((member) => {
        const nameMatch = member.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        const genderMatch =
          genderFilter === "All" || member.gender === genderFilter;
        const groupMatch =
          groupFilter === "All" || member.group.name === groupFilter;
        return nameMatch && genderMatch && groupMatch;
      });
      setFilteredMembers(filtered);
      setSelectAll(filtered.every((member) => selectedMembers.has(member._id)));
      setIsFiltering(false);
    }
  }, [members, searchTerm, genderFilter, groupFilter, selectedMembers]);

  if (isLoading) return <CircularProgress />;
  if (isError)
    return <Typography>Error loading members. Please try again.</Typography>;

  const handleSelectAll = (event) => {
    const newSelectedMembers = new Set(selectedMembers);
    if (event.target.checked) {
      filteredMembers.forEach((member) => newSelectedMembers.add(member._id));
    } else {
      filteredMembers.forEach((member) =>
        newSelectedMembers.delete(member._id)
      );
    }
    setSelectedMembers(newSelectedMembers);
    setSelectAll(event.target.checked);
  };

  const handleToggleSelected = (memberId) => {
    const newSelectedMembers = new Set(selectedMembers);
    if (newSelectedMembers.has(memberId)) {
      newSelectedMembers.delete(memberId);
    } else {
      newSelectedMembers.add(memberId);
    }
    setSelectedMembers(newSelectedMembers);
    setSelectAll(
      filteredMembers.every((member) => newSelectedMembers.has(member._id))
    );
  };

  const handleAddGift = () => {
    const selectedMembersArray = Array.from(selectedMembers);
    const selectedMembersData = members.filter((member) =>
      selectedMembersArray.includes(member._id)
    );
    // Here you would typically dispatch an action or call an API to add the new gift
    console.log("Adding new gift:", {
      ...newGift,
      members: selectedMembersData,
    });
    navigate("/dashboard/gift-room"); // Navigate back to the gift room page
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography
        color={"secondary"}
        variant="h5"
        sx={{ fontWeight: "bold" }}
        mb={2}
      >
        Add New Gift Room
      </Typography>
      <TextField
        autoFocus
        margin="dense"
        label="Gift Name"
        type="text"
        fullWidth
        value={newGift.name}
        onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
        sx={{ mb: 2 }}
      />
      <TextField
        margin="dense"
        label="Description"
        type="text"
        fullWidth
        value={newGift.description}
        onChange={(e) =>
          setNewGift({ ...newGift, description: e.target.value })
        }
        sx={{ mb: 2 }}
      />
      <Box sx={{ marginTop: 2 }}>
        <TextField
          label="Search by name"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ width: "100%", marginBottom: 2 }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 2,
          }}
        >
          <FormControl sx={{ width: "48%" }}>
            <InputLabel>Gender</InputLabel>
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              label="Gender"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="M">Male</MenuItem>
              <MenuItem value="F">Female</MenuItem>
            </Select>
          </FormControl>
          <FormControl sx={{ width: "48%" }}>
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
        <Typography
          variant="h6"
          sx={{ mt: 2, fontWeight: "bold" }}
          color={"secondary"}
        >
          Selected Members: {selectedMembers.size}
        </Typography>
      </Box>
      {isFiltering ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Group</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell align="center">Selected</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMembers.map((member) => (
                <TableRow key={member._id}>
                  <TableCell>{member.name}</TableCell>
                  <TableCell>{member.group.name}</TableCell>
                  <TableCell>{member.gender}</TableCell>
                  <TableCell>{member.age}</TableCell>
                  <TableCell align="center">
                    <Checkbox
                      checked={selectedMembers.has(member._id)}
                      onChange={() => handleToggleSelected(member._id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button onClick={() => navigate("/dashboard/gift-room")} sx={{ mr: 1 }}>
          Cancel
        </Button>
        <Button onClick={handleAddGift} variant="contained" color="primary">
          Add Gift Room
        </Button>
      </Box>
    </Box>
  );
};

export default AddGiftRoom;
