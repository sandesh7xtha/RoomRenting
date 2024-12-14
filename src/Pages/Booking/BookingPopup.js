import React, { useState, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Paper from "@mui/material/Paper";
import Draggable from "react-draggable";
import { AiOutlineClose } from "react-icons/ai";
import { DialogActions, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import "../../cssStyle/BookingPopup.css";

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

const BookingPopup = ({ room, onConfirm, clickHTML }) => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState("booking"); // Tracks current step: 'booking' or 'payment'
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentError, setPaymentError] = useState(""); // To handle payment errors
  const [paymentSuccess, setPaymentSuccess] = useState(false); // For payment success state
  const [bookingID, setBookingID] = useState(null); // State to store bookingID

  // Get customerID from localStorage
  const customerID = localStorage.getItem("userId");

  // Handle the popup open and close
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setStep("booking"); // Reset to booking step
    setError("");
    setSuccessMessage("");
    setPaymentError(""); // Reset payment error state
    setPaymentSuccess(false); // Reset payment success state
  };

  // Formik setup
  const formik = useFormik({
    initialValues: {
      checkInDate: "",
      checkOutDate: "",
    },
    validationSchema: Yup.object({
      checkInDate: Yup.string().required("Check-In Date is required"),
      checkOutDate: Yup.string().required("Check-Out Date is required"),
    }),
    onSubmit: (values) => {
      setError("");
      setSuccessMessage("");
      const checkInDate = new Date(values.checkInDate);
      const checkOutDate = new Date(values.checkOutDate);
      const totalDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 3600 * 24)
      );
      const pricePerDay = room.PricePerMonth / 30;
      const totalAmount = pricePerDay * totalDays;
      setTotalAmount(totalAmount); // Update total amount for payment UI
    },
  });

  // Calculate total amount based on selected dates
  useEffect(() => {
    if (formik.values.checkInDate && formik.values.checkOutDate) {
      const checkInDate = new Date(formik.values.checkInDate);
      const checkOutDate = new Date(formik.values.checkOutDate);
      const totalDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 3600 * 24)
      );
      const pricePerDay = room.PricePerMonth / 30;
      setTotalAmount(pricePerDay * totalDays);
    }
  }, [
    formik.values.checkInDate,
    formik.values.checkOutDate,
    room.PricePerMonth,
  ]);

  // Merged function to handle booking and payment
  const handleBookingAndPayment = async () => {
    try {
      // Step 1: Book the room
      const response = await axios.post(
        "http://localhost:4000/booking/book-room",
        {
          roomID: room.RoomID,
          customerID: customerID,
          checkInDate: formik.values.checkInDate,
          checkOutDate: formik.values.checkOutDate,
          totalAmount: totalAmount,
        }
      );

      const { bookingID } = response.data; // Get the bookingID from the response
      setBookingID(bookingID); // Store the bookingID
      setSuccessMessage("Booking successful!");

      // Step 2: Process the payment immediately after booking
      const paymentResponse = await axios.post(
        "http://localhost:4000/payment/process-payment",
        {
          bookingID: bookingID, // Use the actual booking ID here
          amount: totalAmount,
          paymentDate: new Date().toISOString().split("T")[0], // Current date
          paymentStatus: "Completed", // Assuming payment is successful
        }
      );

      setPaymentSuccess(true); // Set payment success
      setPaymentError(""); // Reset any previous payment error
    } catch (error) {
      setPaymentError("Payment failed. Please try again.");
      setPaymentSuccess(false); // Reset payment success if there's an error
    }
  };

  return (
    <div className="booking-popup-container">
      <div className="action-trigger" onClick={handleClickOpen}>
        {clickHTML}
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle
          id="draggable-dialog-title"
          className="dialog-title-container"
        >
          <div className="dialog-header">
            <span>
              {step === "booking" ? "Booking Form" : "Payment Details"}
            </span>
            <AiOutlineClose className="close-icon" onClick={handleClose} />
          </div>
        </DialogTitle>
        <div className="booking-popup-content">
          {step === "booking" ? (
            <form onSubmit={formik.handleSubmit}>
              <Typography variant="h6" component="div">
                {room.RoomType}
              </Typography>
              <Typography color="text.secondary">
                {room.BuildingName} - {room.BuildingAddress}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price per Month: £{room.PricePerMonth}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Max Occupancy: {room.MaxOccupancy} person(s)
              </Typography>

              {successMessage && (
                <Typography className="success-message">
                  {successMessage}
                </Typography>
              )}
              {error && (
                <Typography className="error-message">{error}</Typography>
              )}

              <div className="form-input-group">
                <label className="form-label">Check-In Date</label>
                <input
                  type="date"
                  name="checkInDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.checkInDate}
                  className="form-input"
                />
                {formik.touched.checkInDate && formik.errors.checkInDate && (
                  <div className="error">{formik.errors.checkInDate}</div>
                )}
              </div>
              <div className="form-input-group">
                <label className="form-label">Check-Out Date</label>
                <input
                  type="date"
                  name="checkOutDate"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.checkOutDate}
                  className="form-input"
                />
                {formik.touched.checkOutDate && formik.errors.checkOutDate && (
                  <div className="error">{formik.errors.checkOutDate}</div>
                )}
              </div>

              <div className="total-amount">
                <Typography variant="body2" color="text.primary">
                  Total Amount: £{totalAmount.toFixed(2)}
                </Typography>
              </div>

              <DialogActions className="dialog-actions-container">
                <button
                  type="button"
                  className="confirm-button"
                  onClick={() => setStep("payment")}
                >
                  Confirm Booking
                </button>
              </DialogActions>
            </form>
          ) : (
            <div>
              <Typography variant="h6" component="div">
                Payment Details
              </Typography>
              <Typography color="text.secondary">
                Total Amount: £{totalAmount.toFixed(2)}
              </Typography>
              {paymentError && (
                <Typography className="error-message">
                  {paymentError}
                </Typography>
              )}
              {paymentSuccess && (
                <Typography className="success-message">
                  Payment Successful!
                </Typography>
              )}

              {/* Card Details Form */}
              <form>
                <div className="form-input-group">
                  <TextField
                    label="Card Number"
                    variant="outlined"
                    fullWidth
                    type="text"
                    inputProps={{ maxLength: 16 }}
                    className="form-input"
                  />
                </div>

                <div className="form-input-group">
                  <TextField
                    label="Expiration Date"
                    variant="outlined"
                    fullWidth
                    type="text"
                    inputProps={{ maxLength: 5 }}
                    className="form-input"
                  />
                </div>

                <div className="form-input-group">
                  <TextField
                    label="CVV"
                    variant="outlined"
                    fullWidth
                    type="text"
                    inputProps={{ maxLength: 3 }}
                    className="form-input"
                  />
                </div>

                <DialogActions className="dialog-actions-container">
                  <button
                    type="button"
                    className="confirm-button"
                    onClick={handleBookingAndPayment}
                  >
                    Pay Now
                  </button>
                </DialogActions>
              </form>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default BookingPopup;
