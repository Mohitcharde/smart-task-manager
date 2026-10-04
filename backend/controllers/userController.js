const { users, findUserByEmail, generateId } = require('../data/store');

function registerUser(req, res) {
  const { name, email } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: 'User name cannot be empty.' });
  }

  if (!email || !String(email).trim()) {
    return res.status(400).json({ message: 'User email cannot be empty.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'Enter a valid email address.' });
  }

  if (findUserByEmail(normalizedEmail)) {
    return res.status(409).json({ message: 'An account with this email already exists.' });
  }

  const newUser = {
    id: generateId('user'),
    name: String(name).trim(),
    email: normalizedEmail,
    role: 'User'
  };

  users.push(newUser);
  return res.status(201).json({
    message: 'Registration successful. You can now sign in.',
    user: newUser
  });
}

function createUser(req, res) {
  const { name, email, role } = req.body || {};

  if (!name || !String(name).trim()) {
    return res.status(400).json({ message: 'User name cannot be empty.' });
  }

  if (!email || !String(email).trim()) {
    return res.status(400).json({ message: 'User email cannot be empty.' });
  }

  if (findUserByEmail(email)) {
    return res.status(400).json({ message: 'User with this email already exists.' });
  }

  const newUser = {
    id: generateId('user'),
    name: String(name).trim(),
    email: String(email).trim(),
    role: role === 'Admin' ? 'Admin' : 'User'
  };

  users.push(newUser);
  return res.status(201).json({
    message: 'User created successfully.',
    user: newUser
  });
}

function listUsers(req, res) {
  return res.status(200).json(users);
}

function loginUser(req, res) {
  const { email } = req.body || {};

  if (!email || !String(email).trim()) {
    return res.status(400).json({ message: 'User email cannot be empty.' });
  }

  const user = findUserByEmail(email);

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  return res.status(200).json({
    message: 'Login successful.',
    user
  });
}

module.exports = {
  registerUser,
  createUser,
  listUsers,
  loginUser
};
