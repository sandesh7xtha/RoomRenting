import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LogIn from "./Pages/Login/LogIn";
import NewAcc from "./Pages/Login/NewAcc";
import DashboardCustomer from "./Pages/dashboard/DashboardCustomer";
import DashboardAdmin from "./Pages/dashboard/DashboardAdmin";
// import Navbar from "./Pages/Navbar/Navbar";

function App() {
  // Simulate getting token and userType from localStorage
  const getToken = () => localStorage.getItem("token");
  const getUserType = () => localStorage.getItem("userType");

  // Protected Route Component
  const ProtectedRoute = ({ element: Component }) => {
    const token = getToken();
    if (!token) {
      // Redirect to login if no token
      return <Navigate to="/" replace />;
    }
    return Component;
  };

  return (
    <>
      {/* <Navbar /> */}
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LogIn />} />
          <Route path="/sign-in" element={<LogIn />} />
          <Route path="/create-account" element={<NewAcc />} />

          {/* Redirect based on userType */}
          <Route
            path="/Dashboard"
            element={
              getToken() && getUserType() === "Tenant" ? (
                <ProtectedRoute element={<DashboardCustomer />} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/Dashboard-Admin"
            element={
              getToken() && getUserType() === "Admin" ? (
                <ProtectedRoute element={<DashboardAdmin />} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
