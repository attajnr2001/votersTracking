import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Box } from "@mui/material";
import Widget from "../components/Widget";
const RootLayout = () => {
  return (
    <Container>
      <Navbar />
      <Box
        sx={{
          display: { xs: "block", md: "flex" },
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          gap: 2,
          padding: 2,
        }}
      >
        <Widget type="all" />
        <Widget type="below40" />
        <Widget type="above40" />
      </Box>
      <Outlet />
    </Container>
  );
};

export default RootLayout;
