const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./schema.js'); 

dotenv.config(); // Load environment variables

const app = express();
app.use(express.json()); // Middleware to parse JSON

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to database'))
  .catch(err => console.error(`Error connecting to database: ${err.message}`));

// POST API to create a new user
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: `Validation error: ${error.message}` });
    } else {
      res.status(500).json({ message: `Server error: ${error.message}` });
    }
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});