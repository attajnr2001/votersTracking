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
  Button,IconButton
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const EditGiftRoom = () => {
  const [members, setMembers] = useState([]);
  const [gift, setGift] = useState(null);
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
    setMembers([
      {
        id: 1,
        name: "John Doe",
        group: "Group A",
        number: "1234567890",
        gender: "M",
        age: 30,
        occupation: "Teacher",
        hasReceived: false,
      },
      {
        id: 2,
        name: "Jane Smith",
        group: "Group B",
        number: "0987654321",
        gender: "F",
        age: 25,
        occupation: "Engineer",
        hasReceived: true,
      },
      // Add more members as needed
    ]);
  }, [giftId]);

  const handleToggleReceived = (memberId) => {
    setMembers(
      members.map((member) =>
        member.id === memberId
          ? { ...member, hasReceived: !member.hasReceived }
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
    <Box sx={{ padding: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
        <IconButton onClick={handleBack} sx={{ marginRight: 1 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Edit Gift Room: {gift.name}</Typography>
      </Box>
      <Typography variant="subtitle1" gutterBottom>
        {gift.description}
      </Typography>
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
            {members.map((member) => (
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
