import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../helpers/firebaseConfig";
import { v4 as uuidv4 } from "uuid";
import {
  useGetGalleryItemsQuery,
  useAddGalleryItemMutation,
  useUpdateGalleryItemMutation,
  useDeleteGalleryItemMutation,
} from "../slices/galleryApiSlice";
import {
  Box,
  Grid,
  Button,
  Snackbar,
  Alert,
  Skeleton,
  Typography,
  Tooltip,
} from "@mui/material";
import "../styles/gallery.css";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddGallery from "../mod/AddGallery";
import MyLocationIcon from "@mui/icons-material/MyLocation";

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
    description: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Snackbar state
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const handleOpenDialog = (item = null) => {
    if (item) {
      setFormData(item);
      setEditingId(item._id);
      setImagePreview(item.image);
    } else {
      setFormData({
        name: "",
        year: "",
        image: "",
        location: "",
        description: "",
      });
      setEditingId(null);
      setImagePreview(null);
    }
    setImageFile(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData({
      name: "",
      year: "",
      image: "",
      location: "",
      description: "",
    });
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToFirebase = async (file) => {
    if (!file) return null;
    const fileRef = ref(storage, `gallery_images/${uuidv4()}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  };

  const handleSubmit = async () => {
    try {
      let imageUrl = formData.image;
      if (imageFile) {
        imageUrl = await uploadImageToFirebase(imageFile);
      }

      const updatedFormData = { ...formData, image: imageUrl };

      if (editingId) {
        await updateGalleryItem({ id: editingId, ...updatedFormData }).unwrap();
      } else {
        await addGalleryItem(updatedFormData).unwrap();
      }
      handleCloseDialog();
      handleSnackbarOpen("Gallery item saved successfully", "success");
    } catch (err) {
      console.error("Failed to save the gallery item", err);
      handleSnackbarOpen("Failed to save the gallery item", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGalleryItem(id).unwrap();
      handleSnackbarOpen("Gallery item deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete the gallery item", err);
      handleSnackbarOpen("Failed to delete the gallery item", "error");
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

  const GallerySkeleton = () => (
    <Box className="card__article" sx={{ mb: 2 }}>
      <Skeleton variant="rectangular" width="100%" height={200} />
      <Box sx={{ pt: 1 }}>
        <Skeleton width="60%" />
        <Skeleton width="40%" />
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Skeleton width="30%" />
          <Box>
            <Skeleton
              width={60}
              height={30}
              sx={{ mr: 1, display: "inline-block" }}
            />
            <Skeleton width={60} height={30} sx={{ display: "inline-block" }} />
          </Box>
        </Box>
      </Box>
    </Box>
  );

  if (isError) return <div>Error: {error.message}</div>;

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
        <Box className="container">
          {isLoading
            ? Array.from(new Array(6)).map((_, index) => (
                <GallerySkeleton key={index} />
              ))
            : galleryItems.map((item) => (
                <article key={item._id} className="card__article">
                  <img src={item.image} alt={item.name} className="card__img" />
                  <Box className="card__data">
                    <Tooltip
                      title={item.description}
                      arrow
                      placement="top-start"
                    >
                      <Typography className="card__description">
                        <MyLocationIcon color="error"/>
                        {item.location}
                      </Typography>
                    </Tooltip>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontWeight: "bold",
                            color: "#333",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {item.name.toUpperCase()}
                        </Typography>
                        <Button variant="contained" size="small">
                          {item.year}
                        </Button>
                      </Box>
                      <Box className="actions">
                        <Button
                          sx={{ mr: 1 }}
                          variant="outlined"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenDialog(item)}
                        >
                          <EditIcon />
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => handleDelete(item._id)}
                        >
                          <DeleteForeverIcon />
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </article>
              ))}
        </Box>
      </Grid>

      <AddGallery
        open={openDialog}
        onClose={handleCloseDialog}
        formData={formData}
        editingId={editingId}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        imagePreview={imagePreview}
      />

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Gallery;
