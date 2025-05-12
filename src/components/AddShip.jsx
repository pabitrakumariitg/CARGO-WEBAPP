import * as React from "react";
import { Box, TextField, MenuItem, Button } from "@mui/material";
import { Shipments } from "../store/Shipment.api.js";
import { useStore } from "zustand";
import { toast } from "react-toastify";
import locationData from "../store/location.json"; // Adjust the path if necessary

const statusOptions = ["In Transit", "Delivered", "Delayed", "Pending"];

export default function AddShip({ onClose }) {
  const { addShipment } = useStore(Shipments);

  const [form, setForm] = React.useState({
    shipmentId: "",
    containerId: "",
    currentLocation: { location: "", latitude: "", longitude: "" }, // Change to an object
    eta: new Date().toISOString().split("T")[0], // today's date
    status: "Pending",
    route: ["India"], // Example route, you can modify it as required
  });

  // Handles the location change to set lat, lng along with location name
  const handleLocationChange = (e) => {
    const selectedLocation = locationData.find(
      (loc) => loc.location === e.target.value
    );
    if (selectedLocation) {
      setForm((prev) => ({
        ...prev,
        currentLocation: {
          location: selectedLocation.location,
          lat: selectedLocation.latitude,
          lng: selectedLocation.longitude,
        },
      }));
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Make sure the form is passing lat and lng in currentLocation
    console.log(form)
    const success = await addShipment(form);
    if (success) {
      toast.success("Shipment added successfully!");
      if (onClose) onClose(); // Close the modal only if successful
    } else {
      toast.error("Failed to add shipment");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        p: 2,
        "& .MuiTextField-root": { width: "25ch" },
      }}
      autoComplete="off"
    >
      <TextField
        required
        name="shipmentId"
        label="Shipment ID"
        value={form.shipmentId}
        onChange={handleChange}
      />
      <TextField
        required
        name="containerId"
        label="Container ID"
        value={form.containerId}
        onChange={handleChange}
      />
      <TextField
        select
        required
        name="currentLocation"
        label="Current Location"
        value={form.currentLocation.location} // Display the location name
        onChange={handleLocationChange} // Use handleLocationChange to update lat/lng
      >
        {locationData.map((location) => (
          <MenuItem key={location.location} value={location.location}>
            {location.location}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        name="eta"
        label="ETA"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={form.eta}
        onChange={handleChange}
      />
      <TextField
        select
        name="status"
        label="Status"
        value={form.status}
        onChange={handleChange}
      >
        {statusOptions.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </TextField>
      <Box sx={{ alignSelf: "center", mt: 1 }}>
        <Button type="submit" variant="contained" color="success">
          Submit
        </Button>
      </Box>
    </Box>
  );
}
