import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Container, Box, Typography, Button } from "@mui/material";
import { useSelector } from "react-redux";
import Widget from "../components/Widget";

const RootLayout = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <Container>
        <Navbar />
        {userInfo.psCode === "all" ? (
          <>
            <Button variant="outlined" color="secondary">
              POLLING STATION CODE: ADMIN
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" color="secondary">
              POLLING STATION CODE: {userInfo.psCode}
            </Button>
          </>
        )}

        <Box
          sx={{
            display: { xs: "block", md: "flex" },
            flexDirection: { xs: "column", md: "row" },
            justifyContent: "space-between",
            gap: 2,
            padding: 2,
          }}
        >
          <Widget type="all" psCode={userInfo.psCode} />
          <Widget type="below40" psCode={userInfo.psCode} />
          <Widget type="above40" psCode={userInfo.psCode} />
        </Box>
        <Outlet />
      </Container>
      <Footer />
    </>
  );
};

export default RootLayout;
