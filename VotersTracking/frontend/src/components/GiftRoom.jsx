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
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";

const GiftRoom = () => {
  const [gifts, setGifts] = useState([]);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newGift, setNewGift] = useState({ name: "", description: "" });
  const navigate = useNavigate();

  // Simulated data - replace this with actual API call
  useEffect(() => {
    setGifts([
      {
        id: 1,
        date: "2023-08-01",
        name: "T-Shirt",
        description: "Campaign T-Shirt",
        percentageReceived: 75,
      },
      {
        id: 2,
        date: "2023-08-15",
        name: "Cap",
        description: "NPP Cap",
        percentageReceived: 60,
      },
      {
        id: 3,
        date: "2023-09-01",
        name: "Poster",
        description: "Candidate Poster",
        percentageReceived: 90,
      },
    ]);
  }, []);

  const handleEditGift = (giftId) => {
    navigate(`/dashboard/edit-gift/${giftId}`);
  };

  const handleOpenAddDialog = () => {
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
    setNewGift({ name: "", description: "" });
  };

  const handleAddGift = () => {
    // Implement the logic to add a new gift
    console.log("Adding new gift:", newGift);
    // After adding, you might want to refresh the gift list
    // setGifts([...gifts, { id: Date.now(), ...newGift, percentageReceived: 0 }]);
    handleCloseAddDialog();
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 2,
        }}
      >
        <Typography variant="h4">Gift Room</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenAddDialog}
        >
          Add Gift Room
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="center">Percentage Received</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {gifts.map((gift) => (
              <TableRow key={gift.id}>
                <TableCell>{gift.date}</TableCell>
                <TableCell>{gift.name}</TableCell>
                <TableCell>{gift.description}</TableCell>
                <TableCell align="center">
                  <Box sx={{ position: "relative", display: "inline-flex" }}>
                    <CircularProgress
                      variant="determinate"
                      value={gift.percentageReceived}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: "absolute",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Typography
                        variant="caption"
                        component="div"
                        color="text.secondary"
                      >
                        {`${Math.round(gift.percentageReceived)}%`}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="outlined"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEditGift(gift.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Add New Gift Room</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Gift Name"
            type="text"
            fullWidth
            value={newGift.name}
            onChange={(e) => setNewGift({ ...newGift, name: e.target.value })}
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
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancel</Button>
          <Button onClick={handleAddGift} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GiftRoom;
