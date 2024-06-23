import React from "react";
import { Grid, Button, Typography, Box, Container } from "@mui/material";
import backgroundImage from "../assets/bg3.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Welcome = () => {
  const imageStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    height: "100vh",
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Container>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Grid container>
          <Grid
            item
            xs={12}
            md={6}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Box textAlign="center">
              <motion.div variants={itemVariants}>
                <Typography
                  color={"secondary"}
                  sx={{ textTransform: "uppercase", fontWeight: "bold" }}
                  variant="h4"
                  gutterBottom
                  component={motion.h4}
                >
                  Welcome to the EFUTu NPP VOTERs Platfrom
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Typography variant="body1" gutterBottom component={motion.p}>
                  Welcome to the digital hub of the Effutu NPP Voters Platform.
                  This innovative portal is designed to empower and connect our
                  community, providing you with essential resources and
                  up-to-date information. Here, you can easily access voter
                  registration details, stay informed about local party events,
                  and engage with fellow supporters. Our platform aims to
                  strengthen our collective voice and ensure that every vote
                  counts in shaping the future of Effutu and Ghana at large.
                  Join us in this digital revolution as we work together towards
                  progress and prosperity for our constituency.
                </Typography>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Button
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/login"
                  style={{ marginTop: "20px" }}
                >
                  Login
                </Button>
              </motion.div>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} style={{ position: "relative" }}>
            <motion.div
              style={imageStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            />
            <Typography
              variant="subtitle1"
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{
                position: "absolute",
                bottom: "20px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                padding: "5px 10px",
                borderRadius: "5px",
              }}
            >
              HON. AFENYO MARKIN
            </Typography>
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Welcome;
