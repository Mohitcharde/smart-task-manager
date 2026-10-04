const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { initializeSampleData } = require('./data/store');

const app = express();
const PORT = process.env.PORT || 5000;

initializeSampleData();

app.use(cors());
app.use(express.json({ limit: '3mb' }));

app.use('/api', userRoutes);
app.use('/api', taskRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Smart Task Manager backend is running.' });
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
