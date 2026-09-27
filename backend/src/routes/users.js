
// SMART TASK MANAGER - USER ROUTES


// Import Express.
// Express Router allows us to create separate routes
// for user-related functionality.
const express = require("express");

// Create a router object.
const router = express.Router();

// Import our in-memory users Map and ID generator.
const {
  users,
  generateUserId
} = require("../data/store");


// POST /api/users/register

// Purpose:
// Create a new user.
//
// Request body example:
// {
//   "name": "Mohit Charde",
//   "email": "mohit@example.com",
//   "password": "123456"
// }


router.post("/register", (req, res) => {
  // Get user information from the request body.
  const { name, email, password } = req.body;

  
  // VALIDATION
  

  // Check whether all required fields were provided.
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "Name, email and password are required"
    });
  }

  // Check whether a user with the same email
  // already exists.
  const existingUser = Array.from(users.values()).find(
    (user) => user.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "A user with this email already exists"
    });
  }

  
  // CREATE USER
  

  // Generate a unique ID.
  const id = generateUserId();

  // Create the user object.
  const newUser = {
    id,
    name: name.trim(),
    email: email.trim().toLowerCase(),

    // IMPORTANT:
    // This assignment specifically allows mock login.
    // Therefore, we are keeping the password directly
    // in memory instead of implementing password hashing.
    password
  };

  // Store the new user in our Map.
  users.set(id, newUser);

  // Return successful response.
  res.status(201).json({
    success: true,
    message: "User registered successfully",

    // Do not return the password in the response.
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    }
  });
});


// POST /api/users/login

// Purpose:
// Mock user login.
//
// Request body:
// {
//   "email": "mohit@example.com",
//   "password": "123456"
// }


router.post("/login", (req, res) => {
  // Get login credentials.
  const { email, password } = req.body;

  // Check required fields.
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email and password are required"
    });
  }

  // Find the user using their email.
  const user = Array.from(users.values()).find(
    (user) => user.email === email.toLowerCase()
  );

  // Check whether user exists.
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  // Check whether password matches.
  if (user.password !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password"
    });
  }

  // Return user information.
  res.json({
    success: true,
    message: "Login successful",

    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// GET /api/users

// Purpose:
// Return all registered users.
//
// This will later be used by the task assignment
// feature so that tasks can be assigned to users

router.get("/", (req, res) => {
  // Convert Map values into an array.
  const userList = Array.from(users.values()).map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email
  }));

  // Return users.
  res.json({
    success: true,
    count: userList.length,
    users: userList
  });
});


// EXPORT ROUTER


module.exports = router;