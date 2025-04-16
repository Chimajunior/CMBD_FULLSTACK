import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import { createRequestHandler } from '@remix-run/express';

// DB and Routes
import pool from './db/index.js';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import recommendRoutes from './routes/recommendRoutes.js';
import searchRoutes from './routes/searchRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import watchlistRoutes from './routes/watchlistRoutes.js';
import userRoutes from './routes/userRoutes.js';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const isDev = process.env.NODE_ENV === 'development';

app.use(cors());
app.use(bodyParser.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/recommendations', recommendRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get("/health", (req, res) => {
  res.send("Server is running");
});

try {
  const conn = await pool.getConnection();
  console.log("Connected to MySQL!");
  conn.release();
} catch (err) {
  console.error("MySQL connection failed:", err.message);
}

// DB connection test route
app.get("/api/db-test", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    res.json({ result: rows[0].result });
  } catch (error) {
    console.error("DB Test Error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Static assets
app.use(express.static(path.join(__dirname, "public"), { maxAge: "1h" }));

// Remix app handler
app.all(
  "*",
  createRequestHandler({
    build: await import('./build/index.js'),
    mode: isDev ? "development" : "production",
  })
);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');

// const pool = require('./db');
// const authRoutes = require('./routes/authRoutes.js');
// const movieRoutes = require('./routes/movieRoutes');
// const reviewRoutes = require('./routes/reviewRoutes');
// const recommendRoutes = require('./routes/recommendRoutes'); 
// const searchRoutes = require('./routes/searchRoutes');
// const profileRoutes = require("./routes/profileRoutes.js");
// const watchlistRoutes = require("./routes/watchlistRoutes");
// const userRoutes = require('./routes/userRoutes');

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/movies', movieRoutes);
// app.use('/api/reviews', reviewRoutes);
// app.use('/api/recommendations', recommendRoutes);
// app.use('/api/search', searchRoutes);
// app.use("/api/profile", profileRoutes);
// app.use("/api/watchlist", watchlistRoutes);
// app.use("/api/users", userRoutes); 

// // Health check
// app.get("/health", (req, res) => {
//   res.send("Server is running");
// });

// // DB test
// app.get("/api/db-test", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT 1 + 1 AS result");
//     res.json({ result: rows[0].result });
//   } catch (error) {
//     console.error("DB Test Error:", error.message);
//     res.status(500).json({ error: error.message });
//   }
//   console.log("Trying DB test route");

// });
// console.log("ENV PORT:", process.env.PORT);


// const PORT = process.env.PORT || 5000;
// app.listen(PORT, '0.0.0.0', () => {
//   console.log(`Server running on port ${PORT}`);
// });

// // const PORT = process.env.PORT;
// // app.listen(PORT, '0.0.0.0', () => {
// //   console.log(`Server running on port ${PORT}`);
// // });
