import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Grid,
  Typography,
  Container,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import axios from "axios"; // Axios for API calls
import Navbar from "../Navbar/Navbar";
import BookingAdmin from "../Booking/BookingAdmin";

const DashboardAdmin = () => {
  const [buildings, setBuildings] = useState([]); // Initialize as empty array
  const [rooms, setRooms] = useState([]); // State to hold rooms
  const [newBuildingData, setNewBuildingData] = useState({
    name: "",
    address: "",
  });

  const [newRoomData, setNewRoomData] = useState({
    buildingId: "",
    roomType: "",
    pricePerMonth: "",
    maxOccupancy: "",
    availability: "",
  });

  // Fetch the list of buildings when the component loads
  useEffect(() => {
    fetchBuildings();
    fetchRooms(); // Fetch rooms on component load
  }, []);

  // Fetch buildings from the API
  const fetchBuildings = async () => {
    try {
      const response = await axios.get(
        "http://localhost:4000/room/list-buildings"
      );
      setBuildings(response.data.buildings);
    } catch (error) {
      console.error("Error fetching buildings:", error);
      alert("Failed to fetch building list. Please try again.");
    }
  };

  // Fetch rooms from the API
  const fetchRooms = async () => {
    try {
      const response = await axios.get("http://localhost:4000/room/list-rooms");
      setRooms(response.data.rooms); // Set rooms in state
    } catch (error) {
      console.error("Error fetching rooms:", error);
      alert("Failed to fetch room list. Please try again.");
    }
  };

  // Handle building input change
  const handleBuildingChange = (e) => {
    const { name, value } = e.target;
    setNewBuildingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit new building data to the API
  const handleBuildingSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/room/add-building",
        newBuildingData
      );
      alert(response.data.message); // Show success message
      fetchBuildings(); // Refresh the list of buildings
      setNewBuildingData({ name: "", address: "" }); // Clear the form
    } catch (error) {
      console.error("Error adding building:", error);
      alert("Failed to add building. Please try again.");
    }
  };

  // Handle room input change
  const handleRoomChange = (e) => {
    const { name, value } = e.target;
    setNewRoomData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Submit new room data to the API
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:4000/room/add-room",
        newRoomData
      );
      alert(response.data.message); // Show success message
      setNewRoomData({
        buildingId: "",
        roomType: "",
        pricePerMonth: "",
        maxOccupancy: "",
        availability: "",
      }); // Clear the room form
      fetchRooms(); // Refresh the list of rooms
    } catch (error) {
      console.error("Error adding room:", error);
      alert("Failed to add room. Please try again.");
    }
  };

  // Toggle room availability
  const handleToggleAvailability = async (roomId, currentAvailability) => {
    try {
      const newAvailability = !currentAvailability;
      const response = await axios.patch(
        `http://localhost:4000/room/room/update-availability/${roomId}`,
        { availability: newAvailability }
      );
      alert(response.data.message); // Show success message
      fetchRooms(); // Refresh the room list after update
    } catch (error) {
      console.error("Error updating room availability:", error);
      alert("Failed to update room availability. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <Container>
        {/* Add Building Section */}
        <Typography variant="h4" gutterBottom>
          Add Building
        </Typography>
        <form onSubmit={handleBuildingSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Building Name"
                name="name"
                value={newBuildingData.name}
                onChange={handleBuildingChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Address"
                name="address"
                value={newBuildingData.address}
                onChange={handleBuildingChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Add Building
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* Building List */}
        <Typography variant="h5" gutterBottom style={{ marginTop: "30px" }}>
          Building List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Building ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {buildings.map((building) => (
                <TableRow key={building.BuildingID}>
                  <TableCell>{building.BuildingID}</TableCell>
                  <TableCell>{building.Name}</TableCell>
                  <TableCell>{building.Address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Add Room Section */}
        <Typography variant="h4" gutterBottom style={{ marginTop: "30px" }}>
          Add Room
        </Typography>
        <form onSubmit={handleRoomSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Building</InputLabel>
                <Select
                  name="buildingId"
                  value={newRoomData.buildingId}
                  onChange={handleRoomChange}
                  label="Building"
                >
                  {buildings.map((building) => (
                    <MenuItem
                      key={building.BuildingID}
                      value={building.BuildingID}
                    >
                      {building.Name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Room Type"
                name="roomType"
                value={newRoomData.roomType}
                onChange={handleRoomChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Price Per Month"
                name="pricePerMonth"
                type="number"
                value={newRoomData.pricePerMonth}
                onChange={handleRoomChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Max Occupancy"
                name="maxOccupancy"
                type="number"
                value={newRoomData.maxOccupancy}
                onChange={handleRoomChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Availability</InputLabel>
                <Select
                  name="availability"
                  value={newRoomData.availability}
                  onChange={handleRoomChange}
                  label="Availability"
                >
                  <MenuItem value={true}>Available</MenuItem>
                  <MenuItem value={false}>Not Available</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit">
                Add Room
              </Button>
            </Grid>
          </Grid>
        </form>
        {/* Room List */}
        <Typography variant="h5" gutterBottom style={{ marginTop: "30px" }}>
          Room List
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Room ID</TableCell>
                <TableCell>Building</TableCell>
                <TableCell>Room Type</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Max Occupancy</TableCell>
                <TableCell>Availability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rooms.map((room) => (
                <TableRow key={room.RoomID}>
                  <TableCell>{room.RoomID}</TableCell>
                  <TableCell>{room.BuildingName}</TableCell>
                  <TableCell>{room.RoomType}</TableCell>
                  <TableCell>{room.PricePerMonth}</TableCell>
                  <TableCell>{room.MaxOccupancy}</TableCell>
                  <TableCell colSpan={2}>
                    <Grid container alignItems="center" spacing={2}>
                      <Grid item>
                        <FormControl fullWidth>
                          <InputLabel>Action</InputLabel>
                          <Select
                            value={
                              room.Availability
                                ? "Mark Unavailable"
                                : "Mark Available"
                            }
                            onChange={(e) =>
                              handleToggleAvailability(
                                room.RoomID,
                                room.Availability
                              )
                            }
                            label="Action"
                          >
                            <MenuItem
                              value="Mark Available"
                              onClick={() =>
                                handleToggleAvailability(room.RoomID, false)
                              }
                            >
                              Available
                            </MenuItem>
                            <MenuItem
                              value="Mark Unavailable"
                              onClick={() =>
                                handleToggleAvailability(room.RoomID, true)
                              }
                            >
                              Unavailable
                            </MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <BookingAdmin />
      </Container>
    </>
  );
};

export default DashboardAdmin;
