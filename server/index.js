const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route files
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/teacher', require('./routes/teacherRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/sync', require('./routes/syncRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: require('mongoose').connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

app.use((req, res, next) => {
  // If it's an API route that wasn't found, return 404 JSON
  if (req.originalUrl.startsWith('/api/')) {
    res.status(404);
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error);
  } else {
    // Basic fallback for non-API routes if needed
    res.status(404).send('Not Found');
  }
});

// JSON Error Handler Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
