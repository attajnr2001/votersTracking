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
                <Typography color={"secondary"}
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
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Harum, culpa, asperiores distinctio laudantium labore odit
                  libero, obcaecati iure reprehenderit a perferendis dignissimos
                  saepe temporibus hic nesciunt neque atque quod molestiae alias
                  rem? Accusantium ex consequatur aut rerum!
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
          <Grid item xs={12} md={6}>
            <motion.div
              style={imageStyle}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
            />
          </Grid>
        </Grid>
      </motion.div>
    </Container>
  );
};

export default Welcome;
