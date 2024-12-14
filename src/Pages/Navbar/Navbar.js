import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user-related data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("userId"); // Remove userId
    localStorage.removeItem("name");
    localStorage.removeItem("email");
    localStorage.removeItem("userType");
    localStorage.removeItem("phoneNumber"); // Remove phoneNumber

    // // Redirect to the login page
    navigate("/");
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>
        <Button
          color="inherit"
          onClick={handleLogout} // Activate logout functionality
          sx={{ textTransform: "none" }}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
