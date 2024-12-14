import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Box,
  Typography,
  Alert,
  IconButton,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion"; // Add Framer Motion for animations
import axios from "axios";

// Validation Schema using Yup
const validationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const LogIn = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    setError(""); // Reset error before submitting
    try {
      const response = await axios.post(
        "http://localhost:4000/user/login",
        values
      );

      // Save details in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);
      localStorage.setItem("userType", response.data.userType);
      localStorage.setItem("phoneNumber", response.data.phoneNumber);

      // Success message and redirection
      alert("Login successful!");
      const userType = localStorage.getItem("userType");
      if (userType === "Tenant") {
        navigate("/Dashboard");
      } else if (userType === "Admin") {
        navigate("/Dashboard-Admin");
      } else {
        throw new Error("Invalid user type received from the server.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "An unexpected error occurred. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{ marginTop: "2rem" }}
        className="login-container"
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "2rem",
            borderRadius: "12px",
            boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
            background: "linear-gradient(145deg, #ffffff, #f0f0f0)",
          }}
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{
              type: "spring",
              stiffness: 120,
            }}
          >
            <Typography
              variant="h3"
              fontWeight="bold"
              gutterBottom
              sx={{
                background: "linear-gradient(90deg, #1cb5e0, #000851)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textAlign: "center",
                animation: "bounce 2s infinite",
              }}
            >
              Room Management System
            </Typography>
          </motion.div>

          {/* Show error message if any */}
          {error && (
            <Alert
              severity="error"
              sx={{ width: "100%", marginBottom: "1rem" }}
            >
              {error}
            </Alert>
          )}

          {/* Formik Form */}
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting, handleChange, handleBlur }) => (
              <Form className="login-form">
                {/* Email Input */}
                <Field
                  as={TextField}
                  label="Email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  className="login-input"
                  margin="normal"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email && Boolean(errors.email)}
                  helperText={touched.email && errors.email}
                  sx={{
                    borderRadius: "8px",
                    background: "white",
                  }}
                />

                {/* Password Input */}
                <Field
                  as={TextField}
                  label="Password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  variant="outlined"
                  fullWidth
                  className="login-input"
                  margin="normal"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    borderRadius: "8px",
                    background: "white",
                  }}
                />

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    className="login-button"
                    sx={{
                      marginTop: "1rem",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      background: "linear-gradient(90deg, #1cb5e0, #000851)",
                      boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                    }}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Signing In..." : "Sign In"}
                  </Button>
                </motion.div>

                {/* Create Account Button */}
                <Button
                  variant="outlined"
                  color="primary"
                  fullWidth
                  className="create-account-button"
                  sx={{
                    marginTop: "1rem",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    borderColor: "#1cb5e0",
                    color: "#1cb5e0",
                    ":hover": {
                      backgroundColor: "#e0f7fa",
                    },
                  }}
                  onClick={() => navigate("/create-account")}
                >
                  Create Account
                </Button>
              </Form>
            )}
          </Formik>
        </Box>
      </Container>
    </motion.div>
  );
};

export default LogIn;
