// components/Gallery.jsx
import React, { useState } from "react";
import {
  useGetGalleryItemsQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from "../slices/galleryApiSlice";
import {
  Box,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

const Gallery = () => {
  const {
    data: galleryItems,
    isLoading,
    isError,
    error,
  } = useGetGalleryItemsQuery();
  const [addGalleryItem] = useAddGalleryItemMutation();
  const [updateGalleryItem] = useUpdateGalleryItemMutation();
  const [deleteGalleryItem] = useDeleteGalleryItemMutation();

  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    year: "",
    image: "",
    location: "",
  });
  const [editingId, setEditingId] = useState(null);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setFormData(item);
      setEditingId(item._id);
    } else {
      setFormData({ name: "", year: "", image: "", location: "" });
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({ name: "", year: "", image: "", location: "" });
    setEditingId(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateGalleryItem({ id: editingId, ...formData }).unwrap();
      } else {
        await addGalleryItem(formData).unwrap();
      }
      handleCloseDialog();
    } catch (err) {
      console.error("Failed to save the gallery item", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGalleryItem(id).unwrap();
    } catch (err) {
      console.error("Failed to delete the gallery item", err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenDialog()}
      >
        Add New Item
      </Button>
      <Grid container spacing={3} sx={{ mt: 3 }}>
        {galleryItems.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item._id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={item.image}
                alt={item.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Year: {item.year}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {item.location}
                </Typography>
                <Button onClick={() => handleOpenDialog(item)}>Edit</Button>
                <Button onClick={() => handleDelete(item._id)}>Delete</Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {editingId ? "Edit Gallery Item" : "Add New Gallery Item"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            variant="standard"
            value={formData.name}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="year"
            label="Year"
            type="number"
            fullWidth
            variant="standard"
            value={formData.year}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="image"
            label="Image URL"
            type="text"
            fullWidth
            variant="standard"
            value={formData.image}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            name="location"
            label="Location"
            type="text"
            fullWidth
            variant="standard"
            value={formData.location}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Gallery;
