import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
  Box,
} from "@mui/material";

const Groups = () => {
  // Mock data for demonstration
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: "Group A",
      leaderName: "John Doe",
      leaderPhone: "123-456-7890",
    },
    {
      id: 2,
      name: "Group B",
      leaderName: "Jane Smith",
      leaderPhone: "098-765-4321",
    },
    // Add more mock data as needed
  ]);

  const handleAddGroup = () => {
    // Implement add group functionality
    console.log("Add group clicked");
  };

  const handleViewMembers = (groupId) => {
    // Implement view members functionality
    console.log("View members clicked for group:", groupId);
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography
          variant="h5"
          component="h2"
          color={"secondary"}
          fontWeight={"bold"}
        >
          GROUPS
        </Typography>
        <Button variant="contained" color="primary" onClick={handleAddGroup}>
          Add Group
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Leader's Name</TableCell>
              <TableCell>Leader's Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.leaderName}</TableCell>
                <TableCell>{group.leaderPhone}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => handleViewMembers(group.id)}
                  >
                    View Group Members
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

export default Groups;
