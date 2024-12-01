const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Store bus locations in memory (for now, use a database for production)
let busLocations = {};

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));


// Endpoint to receive location updates
app.post("/bus/:bus_code/data", (req, res) => {
  const { bus_code, latitude, longitude, time } = req.body;

  console.log("Received data:", { bus_code, latitude, longitude, time });

  if (!bus_code || !latitude || !longitude) {
      return res.status(400).send("Invalid data");
  }

  busLocations[bus_code] = { latitude, longitude, time };
  console.log("Updated bus location:", busLocations);
  res.status(200).send("Location updated successfully");
});

// Endpoint to fetch all bus locations
app.get('/bus/:bus_code/data', (req, res) => {
  const { bus_code } = req.params;

  console.log(`Fetching data for bus_code: ${bus_code}`);
  console.log("All stored bus locations:", busLocations);

  if (!busLocations[bus_code]) {
      return res.status(404).json({ error: `Bus ${bus_code} not found.` });
  }
  res.json(busLocations[bus_code]);
});

app.get("/driver", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "driver.html"));
});

// app.get("/bus/:bus_code", (req, res) => {
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});