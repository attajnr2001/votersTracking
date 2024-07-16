import React from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 0),
  textAlign: "center",
  margin: "3rem 0",
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

const Footer = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
        </Grid>
        <Box mt={2}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} OBE. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
