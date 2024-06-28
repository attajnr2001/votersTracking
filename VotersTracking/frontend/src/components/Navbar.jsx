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
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import Slide from "@mui/material/Slide";
import AddSingleVoter from "../mod/AddSingleVoter";
import AddBulkVoters from "../mod/AddBulkVoters";
import Profile from "../mod/Profile";
import logo from "../assets/logo.png";
import { useSelector, useDispatch } from "react-redux";
import { useLogoutMutation } from "../slices/usersApiSlice";
import { useNavigate, Link } from "react-router-dom";
import { logout } from "../slices/authSlice";

const drawerWidth = 240;

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
  const [openAddSingle, setOpenAddSingle] = useState(false);
  const [openAddBulk, setOpenAddBulk] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [mediaAnchorEl, setMediaAnchorEl] = useState(null);
  const [dataAnchorEl, setDataAnchorEl] = useState(null);
  const [profileAnchorEl, setProfileAnchorEl] = useState(null);
  const [openProfile, setOpenProfile] = useState(false);

  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const navItems = ["ADD VOTERS", "MEDIA", "DATA"];
  if (userInfo.psCode === "all") {
    navItems.push("USERS");
  }

  const handleElectoralAreasClick = () => {
    navigate("/dashboard/electoral-areas");
    handleMenuClose();
  };

  const handleProfileClick = (event) => {
    setProfileAnchorEl(event.currentTarget);
  };

  const handleGroupsClick = () => {
    navigate("/dashboard/groups");
    handleMenuClose();
  };

  const handleHistoryClick = () => {
    navigate("/dashboard/history");
    handleMenuClose();
  };

  const handleGalleryClick = () => {
    navigate("/dashboard/gallery");
    handleMenuClose();
  };

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

  const handleAddVotersClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMediaClick = (event) => {
    setMediaAnchorEl(event.currentTarget);
  };

  const handleDataClick = (event) => {
    setDataAnchorEl(event.currentTarget);
  };

  const handleOpenProfileDialog = () => {
    setOpenProfile(true);
    handleMenuClose();
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMediaAnchorEl(null);
    setDataAnchorEl(null);
    setProfileAnchorEl(null);
  };

  const handleAddSingleClick = () => {
    setOpenAddSingle(true);
    setOpenAddBulk(false);
    handleMenuClose();
  };

  const handleAddBulkClick = () => {
    setOpenAddBulk(true);
    setOpenAddSingle(false);
    handleMenuClose();
  };

  const userFirstLetter = userInfo?.name ? userInfo.name[0].toUpperCase() : "";

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
                item === "ADD VOTERS"
                  ? handleAddVotersClick
                  : item === "MEDIA"
                  ? handleMediaClick
                  : item === "DATA"
                  ? handleDataClick
                  : undefined
              }
            >
              {item}
            </Button>
          ))}
          <IconButton onClick={handleProfileClick}>
            <Avatar
              alt={userInfo?.name}
              src={userInfo?.avatar}
              sx={{
                bgcolor: "transparent",
                color: "#fff",
                border: "3px solid #fff",
              }}
            >
              {!userInfo?.avatar && userFirstLetter}
            </Avatar>{" "}
          </IconButton>
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
              <Link to="/dashboard">
                <Typography color={"white"}>EFUTU NPP</Typography>
              </Link>
            </Box>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              {navItems.map((item) => (
                <Button
                  key={item}
                  sx={{ color: "#fff" }}
                  component={Link}
                  to={item === "USERS" ? "/dashboard/users" : "#"}
                  onClick={
                    item === "ADD VOTERS"
                      ? handleAddVotersClick
                      : item === "MEDIA"
                      ? handleMediaClick
                      : item === "DATA"
                      ? handleDataClick
                      : undefined
                  }
                >
                  {item}
                </Button>
              ))}
              <IconButton onClick={handleProfileClick} sx={{ color: "#fff" }}>
                <Avatar
                  alt={userInfo?.name}
                  src={userInfo?.avatar}
                  sx={{
                    bgcolor: "transparent",
                    color: "#fff",
                    border: "3px solid #fff",
                  }}
                >
                  {!userInfo?.avatar && userFirstLetter}
                </Avatar>
              </IconButton>
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
            keepMounted: true,
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
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleAddSingleClick}>Add Single Voter</MenuItem>
          <MenuItem onClick={handleAddBulkClick}>Add Bulk Voters</MenuItem>
        </Menu>
        <Menu
          anchorEl={mediaAnchorEl}
          open={Boolean(mediaAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleHistoryClick}>History</MenuItem>
          <MenuItem onClick={handleGalleryClick}>Gallery</MenuItem>
        </Menu>
        <Menu
          anchorEl={dataAnchorEl}
          open={Boolean(dataAnchorEl)}
          onClose={handleMenuClose}
        >
          {userInfo.psCode === "all" && (
            <MenuItem onClick={handleElectoralAreasClick}>
              Electoral Areas
            </MenuItem>
          )}
          <MenuItem onClick={handleGroupsClick}>Groups</MenuItem>
        </Menu>
        <Menu
          anchorEl={profileAnchorEl}
          open={Boolean(profileAnchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleOpenProfileDialog}>Profile</MenuItem>
          <MenuItem onClick={logoutHandler}>Logout</MenuItem>
        </Menu>
        <AddSingleVoter
          open={openAddSingle}
          onClose={() => setOpenAddSingle(false)}
        />
        <AddBulkVoters
          open={openAddBulk}
          onClose={() => setOpenAddBulk(false)}
        />
        <Profile
          open={openProfile}
          onClose={() => setOpenProfile(false)}
          user={userInfo}
        />
      </Box>
    </Box>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
