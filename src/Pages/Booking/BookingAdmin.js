import React, { useState, useEffect } from "react";
import axios from "axios"; // For API calls
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false); // Dialog state
  const [selectedBooking, setSelectedBooking] = useState(null); // Selected booking details

  // Fetch bookings from the API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/booking/bookings"
        );
        setBookings(response.data.bookings);
      } catch (error) {
        setError("Error fetching bookings");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Handle dialog open
  const handleDialogOpen = (booking) => {
    setSelectedBooking(booking);
    setOpenDialog(true);
  };

  // Handle dialog close
  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedBooking(null);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Booking List
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room Number</TableCell>
                <TableCell>Building Name</TableCell>
                <TableCell>Room Type</TableCell>
                <TableCell>Total Amount</TableCell>
                <TableCell>Payment Amount</TableCell>
                <TableCell>Payment Status</TableCell>
                <TableCell>details</TableCell> {/* View button column */}
              </TableRow>
            </TableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow key={booking.BookingID}>
                  <TableCell>{booking.RoomID}</TableCell>
                  <TableCell>{booking.BuildingName}</TableCell>
                  <TableCell>{booking.RoomType}</TableCell>
                  <TableCell>{booking.TotalAmount}</TableCell>
                  <TableCell>{booking.PaymentAmount}</TableCell>
                  <TableCell>{booking.PaymentStatus}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleDialogOpen(booking)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog for viewing detailed booking information */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Booking Details</DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Box>
              <Typography variant="h6">
                User Name: {selectedBooking.UserName}
              </Typography>
              <Typography>Email: {selectedBooking.Email}</Typography>
              <Typography>
                Phone Number: {selectedBooking.PhoneNumber}
              </Typography>
              <Typography>
                Check-In Date: {selectedBooking.CheckInDate}
              </Typography>
              <Typography>
                Check-Out Date: {selectedBooking.CheckOutDate}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingList;
