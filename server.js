const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();
const port = 3000;

// Store bus locations in memory (for now, use a database for production)
let busLocations = {};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


// Endpoint to receive location updates
app.post("/update-location", (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).send("Invalid data");
  }

  // Store the bus's location
  // For simplicity, assume a single bus ID (e.g., "bus1")
  busLocations["bus1"] = { latitude, longitude };

  console.log("Updated bus location:", busLocations);
  res.send("Location updated");
});

// Endpoint to fetch all bus locations
app.get("/bus-locations", (req, res) => {
  res.json(busLocations);
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});