import React from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  IconButton,
  InputAdornment,
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { motion } from "framer-motion";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const NewAcc = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      userType: "",
      phoneNumber: "",
      showPassword: false,
      showConfirmPassword: false,
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm Password is required"),
      userType: Yup.string().required("User Type is required"),
      phoneNumber: Yup.string()
        .matches(/^\+?[0-9]{10,20}$/, "Invalid phone number format")
        .required("Phone number is required"),
    }),
    onSubmit: async (values) => {
      const { fullName, email, password, userType, phoneNumber } = values;
      const userData = {
        name: fullName,
        email,
        password,
        userType,
        phoneNumber,
      };

      try {
        const response = await axios.post(
          "http://localhost:4000/user/signup",
          userData
        );
        alert(response.data.message);
        navigate("/sign-in");
      } catch (error) {
        alert(
          error.response?.data?.error || "An error occurred. Please try again."
        );
      }
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.8 }}
    >
      <Box
        sx={{
          maxWidth: "500px",
          mx: "auto",
          mt: 6,
          p: 3,
          borderRadius: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            borderRadius: 4,
          }}
        >
          <form onSubmit={formik.handleSubmit}>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h4"
                align="center"
                gutterBottom
                sx={{ fontWeight: "bold", color: "#333" }}
              >
                Create Your Account
              </Typography>
              <Typography
                variant="body1"
                align="center"
                color="textSecondary"
                gutterBottom
                sx={{ mb: 3 }}
              >
                Please fill in the information below to get started.
              </Typography>
            </motion.div>
            <Grid container spacing={3}>
              {[
                {
                  name: "fullName",
                  label: "Full Name",
                  type: "text",
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                },
                {
                  name: "password",
                  label: "Password",
                  type: formik.values.showPassword ? "text" : "password",
                  adornment: true,
                  showField: "showPassword",
                },
                {
                  name: "confirmPassword",
                  label: "Confirm Password",
                  type: formik.values.showConfirmPassword ? "text" : "password",
                  adornment: true,
                  showField: "showConfirmPassword",
                },
                {
                  name: "phoneNumber",
                  label: "Phone Number",
                  type: "text",
                },
              ].map((field, idx) => (
                <Grid item xs={12} key={idx}>
                  <motion.div
                    initial={{ x: idx % 2 === 0 ? -100 : 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 * idx, duration: 0.6 }}
                  >
                    <TextField
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      fullWidth
                      variant="outlined"
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      error={
                        formik.touched[field.name] &&
                        Boolean(formik.errors[field.name])
                      }
                      helperText={
                        formik.touched[field.name] && formik.errors[field.name]
                      }
                      InputProps={
                        field.adornment
                          ? {
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton
                                    onClick={() =>
                                      formik.setFieldValue(
                                        field.showField,
                                        !formik.values[field.showField]
                                      )
                                    }
                                    edge="end"
                                  >
                                    {formik.values[field.showField] ? (
                                      <VisibilityOff />
                                    ) : (
                                      <Visibility />
                                    )}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }
                          : undefined
                      }
                    />
                  </motion.div>
                </Grid>
              ))}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>User Type</InputLabel>
                  <Select
                    name="userType"
                    value={formik.values.userType}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                      formik.touched.userType && Boolean(formik.errors.userType)
                    }
                  >
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Tenant">Tenant</MenuItem>
                  </Select>
                  {formik.touched.userType && formik.errors.userType && (
                    <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                      {formik.errors.userType}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{
                      padding: 1.5,
                      fontSize: "1.2rem",
                      textTransform: "uppercase",
                      background: "linear-gradient(90deg, #1cb5e0, #000851)",
                    }}
                  >
                    Create Account
                  </Button>
                </motion.div>
              </Grid>

              <Grid item xs={12}>
                <Typography align="center" sx={{ mt: 2 }}>
                  Already have an account?{" "}
                  <Box
                    component="span"
                    onClick={() => navigate("/sign-in")}
                    sx={{
                      fontWeight: "bold",
                      textDecoration: "underline", // Underline the "Sign in" text
                      cursor: "pointer",
                      "&:hover": {
                        color: "primary.main", // Change color on hover
                      },
                    }}
                  >
                    Sign in
                  </Box>
                </Typography>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Box>
    </motion.div>
  );
};

export default NewAcc;
