import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Snackbar,
  Alert,
  CircularProgress,
  TextField,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddGroup from "../mod/AddGroup";
import {
  useGetGroupsQuery,
  useAddGroupMutation,
  useUpdateGroupMutation,
  useDeleteGroupMutation,
} from "../slices/groupsApiSlice";
import { useSelector } from "react-redux";
import GroupMembers from "./GroupMembers";

const Groups = () => {
  const { userInfo } = useSelector((state) => state.auth);
  console.log("userInfo:", userInfo);
  const isSuper = userInfo && userInfo.role === "super";
  console.log("isSuper:", isSuper);

  const { data: groups, isLoading, error } = useGetGroupsQuery();
  const [addGroup] = useAddGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();
  const [viewingGroupId, setViewingGroupId] = useState(null);

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    leaderName: "",
    leaderPhone: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const filteredGroups = useMemo(() => {
    if (!groups) return [];
    return groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  const handleOpenDialog = (group = null) => {
    if (group) {
      setFormData(group);
      setEditingId(group._id);
    } else {
      setFormData({
        name: "",
        leaderName: "",
        leaderPhone: "",
      });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: "",
      leaderName: "",
      leaderPhone: "",
    });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateGroup({ id: editingId, ...formData }).unwrap();
        handleSnackbarOpen("Group updated successfully", "success");
      } else {
        await addGroup(formData).unwrap();
        handleSnackbarOpen("Group added successfully", "success");
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to save the group", err);
      handleSnackbarOpen("Failed to save the group", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGroup(id).unwrap();
      handleSnackbarOpen("Group deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete the group", err);
      handleSnackbarOpen("Failed to delete the group", "error");
    }
  };

  const handleSnackbarOpen = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };

  if (isLoading) return <CircularProgress />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <Box>
      <AnimatePresence mode="wait">
        {viewingGroupId ? (
          <motion.div
            key="groupMembers"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <GroupMembers
              groupId={viewingGroupId}
              onBack={() => setViewingGroupId(null)}
            />
          </motion.div>
        ) : (
          <>
            <motion.div
              key="groupsList"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.2 }}
            >
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
                {isSuper && (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                  >
                    Add Group
                  </Button>
                )}
              </Box>

              <TextField
                label="Search by name"
                variant="outlined"
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>Leader's Name</TableCell>
                      <TableCell>Leader's Phone</TableCell>
                      <TableCell sx={{ textAlign: "center" }}>
                        Actions
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredGroups.map((group) => (
                      <TableRow key={group._id}>
                        <TableCell>{group.name}</TableCell>
                        <TableCell>{group.leaderName}</TableCell>
                        <TableCell>{group.leaderPhone}</TableCell>
                        <TableCell
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            onClick={() => setViewingGroupId(group._id)}
                          >
                            <VisibilityIcon />
                          </Button>
                          {isSuper && (
                            <>
                              <Button
                                size="small"
                                variant="outlined"
                                color="success"
                                onClick={() => handleOpenDialog(group)}
                              >
                                <EditIcon />
                              </Button>
                              <Button
                                size="small"
                                variant="outlined"
                                color="error"
                                onClick={() => handleDelete(group._id)}
                              >
                                <DeleteForeverIcon />
                              </Button>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {isSuper && (
                <AddGroup
                  open={openDialog}
                  onClose={handleCloseDialog}
                  formData={formData}
                  editingId={editingId}
                  handleInputChange={handleInputChange}
                  handleSubmit={handleSubmit}
                />
              )}

              <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
              >
                <Alert
                  onClose={handleSnackbarClose}
                  severity={snackbarSeverity}
                  sx={{ width: "100%" }}
                >
                  {snackbarMessage}
                </Alert>
              </Snackbar>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default Groups;
