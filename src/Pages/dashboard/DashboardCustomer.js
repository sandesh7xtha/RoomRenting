import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios";
import BookingPopup from "../Booking/BookingPopup";
import Navbar from "../Navbar/Navbar";

const DashboardCustomer = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availabilityFilter, setAvailabilityFilter] = useState("all");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        let url = "http://localhost:4000/room/list-rooms-with-buildings";

        // Modify URL based on availability filter
        if (availabilityFilter !== "all") {
          url = `http://localhost:4000/room/list-rooms-by-availability?availability=${availabilityFilter}`;
        }

        const response = await axios.get(url);
        setRooms(response.data.rooms);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setError("Failed to fetch room data.");
        setLoading(false);
      }
    };

    fetchRooms();
  }, [availabilityFilter]); // Re-fetch rooms whenever availability filter changes

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h5">Loading rooms...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom>
          Rooms
        </Typography>

        {/* Availability Filter */}
        <FormControl fullWidth margin="normal">
          <InputLabel id="availability-filter-label">
            Filter by Availability
          </InputLabel>
          <Select
            labelId="availability-filter-label"
            value={availabilityFilter}
            onChange={(e) => setAvailabilityFilter(e.target.value)}
            label="Filter by Availability"
          >
            <MenuItem value="all">All Rooms</MenuItem>
            <MenuItem value="true">Available</MenuItem>
            <MenuItem value="false">Not Available</MenuItem>
          </Select>
        </FormControl>

        <Grid container spacing={4}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} key={room.RoomID}>
              <Card variant="outlined">
                <CardContent>
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

                  {/* Availability Status */}
                  <Typography variant="h6" component="div">
                    {room.Availability === 1 ? "Available" : "Not Available"}
                  </Typography>

                  {/* Pass room details to BookingPopup */}
                  <BookingPopup
                    room={room} // Pass room as a prop
                    clickHTML={
                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Book Now
                      </Button>
                    }
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default DashboardCustomer;
