// --------------------------------------------------
// SMART TASK MANAGER - IN-MEMORY DATA STORE
// --------------------------------------------------

// This Map stores all users.
// The data exists only while the backend server is running.
const users = new Map();

// This Map will store all tasks.
// We will use it later when we create the Task API.
const tasks = new Map();

// --------------------------------------------------
// ID COUNTERS
// --------------------------------------------------

// Starting ID for users.
let nextUserId = 1;

// Starting ID for tasks.
let nextTaskId = 1;

// --------------------------------------------------
// USER ID GENERATOR
// --------------------------------------------------

// Creates a unique ID for every new user.
const generateUserId = () => {
  const id = String(nextUserId);

  // Increase the counter for the next user.
  nextUserId++;

  return id;
};

// --------------------------------------------------
// TASK ID GENERATOR
// --------------------------------------------------

// Creates a unique ID for every new task.
const generateTaskId = () => {
  const id = String(nextTaskId);

  // Increase the counter for the next task.
  nextTaskId++;

  return id;
};

// --------------------------------------------------
// EXPORT DATA
// --------------------------------------------------

// Make these values available to other files.
//
// users          -> stores users
// tasks          -> stores tasks
// generateUserId -> creates user IDs
// generateTaskId -> creates task IDs
module.exports = {
  users,
  tasks,
  generateUserId,
  generateTaskId
};