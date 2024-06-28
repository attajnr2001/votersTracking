import React from "react";
import { Box, Container, Grid, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram, LinkedIn } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";

const FooterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(6, 0),
  textAlign: "center",
}));

const FooterLink = styled(Link)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  "&:hover": {
    color: theme.palette.secondary.main,
  },
}));

const Footer = () => {
  return (
    <FooterContainer>
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              ABOUT US
            </Typography>
            <Typography variant="body2">
              We are dedicated to providing efficient and transparent electoral
              services.
            </Typography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              QUICK LINKS
            </Typography>
            <Box>
              <FooterLink to="/" variant="body2">
                Home
              </FooterLink>
            </Box>
            <Box>
              <FooterLink to="/dashboard" variant="body2">
                Voters
              </FooterLink>
            </Box>
            <Box>
              <FooterLink to="/dashboard/electoral-areas" variant="body2">
                Electoral Area
              </FooterLink>
            </Box>
            <Box>
              <FooterLink to="/dashboard/users" variant="body2">
                Users
              </FooterLink>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" gutterBottom>
              CONNECT WITH US
            </Typography>
            <IconButton color="inherit" aria-label="Facebook">
              <Facebook />
            </IconButton>
            <IconButton color="inherit" aria-label="Twitter">
              <Twitter />
            </IconButton>
            <IconButton color="inherit" aria-label="Instagram">
              <Instagram />
            </IconButton>
            <IconButton color="inherit" aria-label="LinkedIn">
              <LinkedIn />
            </IconButton>
          </Grid>
        </Grid>
        <Box mt={5}>
          <Typography variant="body2" align="center">
            © {new Date().getFullYear()} OBE. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
