import React, { useState } from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import AddSingleVoter from "../mod/AddSingleVoter"; // Assuming this is your AddSingleVoter component
import AddBulkVoters from "../mod/AddBulkVoters"; // Import AddBulkVoters component
import logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../slices/authSlice";

const drawerWidth = 240;
const navItems = ["ADD SINGLE", "ADD BULK", "USERS", "LOGOUT"];

function HideOnScroll(props) {
  const { children, window } = props;
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

HideOnScroll.propTypes = {
  children: PropTypes.element.isRequired,
  window: PropTypes.func,
};

function Navbar(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openAddSingle, setOpenAddSingle] = useState(false); // State for Add Single dialog
  const [openAddBulk, setOpenAddBulk] = useState(false); // State for Add Bulk dialog

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  const handleAddSingleClick = () => {
    setOpenAddSingle(true);
    setOpenAddBulk(false); // Close Add Bulk dialog if open
  };

  const handleAddBulkClick = () => {
    setOpenAddBulk(true);
    setOpenAddSingle(false); // Close Add Single dialog if open
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <img src={logo} alt="Logo" style={{ width: "100px", margin: "20px 0" }} />
      <Divider />
      <List>
        <Box sx={{ display: { xs: "block", sm: "block" } }}>
          {navItems.map((item) => (
            <Button
              key={item}
              sx={{ color: "#333" }}
              component={Link}
              to={item === "USERS" ? "/users" : "#"}
              onClick={
                item === "ADD SINGLE"
                  ? handleAddSingleClick
                  : item === "ADD BULK"
                  ? handleAddBulkClick
                  : item === "LOGOUT"
                  ? logoutHandler
                  : undefined
              }
            >
              {item}
            </Button>
          ))}
        </Box>
      </List>
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <HideOnScroll {...props}>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "flex" },
                alignItems: "center",
                gap: 2,
              }}
            >
              <img src={logo} alt="Logo" style={{ height: "40px" }} />
              <Typography>EFUTU NPP</Typography>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{ color: "#fff" }}
                  component={Link}
                  to={item === "USERS" ? "/dashboard/users" : "#"}
                  onClick={
                    item === "ADD SINGLE"
                      ? handleAddSingleClick
                      : item === "ADD BULK"
                      ? handleAddBulkClick
                      : item === "LOGOUT"
                      ? logoutHandler
                      : undefined
                  }
                >
                  {item}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
      <Box component="main" sx={{ p: 3 }}>
        <Toolbar />
        {/* Render AddSingleVoter dialog with open state and onClose function */}
        <AddSingleVoter
          open={openAddSingle}
          onClose={() => setOpenAddSingle(false)}
        />
        {/* Render AddBulkVoters dialog with open state and onClose function */}
        <AddBulkVoters
          open={openAddBulk}
          onClose={() => setOpenAddBulk(false)}
        />
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
