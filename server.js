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
