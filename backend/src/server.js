// --------------------------------------------------
// SMART TASK MANAGER - BACKEND SERVER
// --------------------------------------------------

// Import Express.
const express = require("express");

// Import CORS.
// This allows our frontend to communicate with the backend.
const cors = require("cors");

// Load variables from the .env file.
require("dotenv").config();

// Import the user routes.
// These routes are defined inside routes/users.js.
const userRoutes = require("./routes/users");

const taskRoutes = require("./routes/tasks");

// --------------------------------------------------
// CREATE EXPRESS APPLICATION
// --------------------------------------------------

const app = express();

// Read the port from .env.
// If PORT is not available, use 5000.
const PORT = process.env.PORT || 5000;

// --------------------------------------------------
// MIDDLEWARE
// --------------------------------------------------

// Enable CORS.
app.use(cors());

// Allow the server to receive JSON data.
app.use(express.json());

// --------------------------------------------------
// HOME ROUTE
// --------------------------------------------------

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Task Manager API is running"
  });
});

// --------------------------------------------------
// HEALTH CHECK
// --------------------------------------------------

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy",
    service: "smart-task-manager-backend"
  });
});

// --------------------------------------------------
// USER ROUTES
// --------------------------------------------------

// Connect users.js to /api/users.
//
// users.js contains:
// POST /register
// POST /login
// GET  /
//
// Therefore the final URLs become:
//
// POST /api/users/register
// POST /api/users/login
// GET  /api/users
// User routes.
app.use("/api/users", userRoutes);

// Task routes.
app.use("/api/tasks", taskRoutes);

// --------------------------------------------------
// START SERVER
// --------------------------------------------------

app.listen(PORT, () => {
  console.log("----------------------------------------");
  console.log("Smart Task Manager Backend");
  console.log(`Server: http://localhost:${PORT}`);
  console.log(`Health: http://localhost:${PORT}/api/health`);
  console.log(`Users: http://localhost:${PORT}/api/users`);
  console.log("----------------------------------------");
});