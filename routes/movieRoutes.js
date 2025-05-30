import express from "express";
import jwt from "jsonwebtoken";
import pool from "../db/index.js";

const router = express.Router();

// Middleware to check Admin
const authenticateAdmin = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(403).json({ message: "Access Denied" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    if (decoded.role !== "admin")
      return res.status(403).json({ message: "Admins only" });
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token" });
  }
};

// Add Movie (Admin Only)
router.post("/", authenticateAdmin, async (req, res) => {
  const { title, genre, release_date, cast, poster_url, description } =
    req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM movies WHERE title = ? AND release_date = ?",
      [title, release_date]
    );

    if (existing.length > 0) {
      return res.status(409).json({ error: "Movie already exists." });
    }

    await pool.query(
      "INSERT INTO movies (title, genre, release_date, cast, poster_url, description) VALUES (?, ?, ?, ?, ?, ?)",
      [title, genre, release_date, cast, poster_url, description]
    );

    res.status(201).json({ message: "Movie added successfully" });
  } catch (error) {
    console.error("Insert error:", error.message);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

// Get Movies with Pagination, Sorting, and Filtering
router.get("/", async (req, res) => {
  try {
    let { page, limit, sort, sortBy, order, genre, year, title } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 100;
    const offset = (page - 1) * limit;

    if (sort === "popular") {
      sortBy = "avg_rating";
      order = "DESC";
    } else if (sort === "trending") {
      sortBy = "release_date";
      order = "DESC";
    } else if (sort === "community") {
      sortBy = "review_count";
      order = "DESC";
    }

    const allowedSortFields = [
      "title",
      "release_date",
      "avg_rating",
      "review_count",
    ];
    sortBy = allowedSortFields.includes(sortBy) ? sortBy : "title";
    order = order && order.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const conditions = [];
    const values = [];

    if (genre) {
      conditions.push("LOWER(m.genre) LIKE ?");
      values.push(`%${genre.toLowerCase()}%`);
    }

    if (year) {
      conditions.push("YEAR(m.release_date) = ?");
      values.push(year);
    }

    if (title) {
      conditions.push("LOWER(m.title) LIKE ?");
      values.push(`%${title.toLowerCase()}%`);
    }

    if (req.query.featured === "true") {
      conditions.push("m.featured = 1");
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const [movies] = await pool.query(
      `SELECT m.*, 
              IFNULL(AVG(r.rating), 0) AS avg_rating, 
              COUNT(r.id) AS review_count
       FROM movies m
       LEFT JOIN reviews r ON m.id = r.movie_id
       ${whereClause}
       GROUP BY m.id
       ORDER BY ${sortBy} ${order}
       LIMIT ? OFFSET ?`,
      [...values, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM movies m ${whereClause}`,
      values
    );

    res.json({
      page,
      totalPages: Math.ceil(total / limit),
      totalMovies: total,
      movies,
    });
  } catch (error) {
    console.error("Error fetching movies:", error.message);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
});

// Update Movie (Admin Only)
router.put("/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, genre, release_date, cast, poster_url, description } =
    req.body;

  try {
    const [movie] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
    if (movie.length === 0)
      return res.status(404).json({ message: "Movie not found" });

    await pool.query(
      "UPDATE movies SET title=?, genre=?, release_date=?, cast=?, poster_url=?, description=? WHERE id=?",
      [title, genre, release_date, cast, poster_url, description, id]
    );

    res.json({ message: "Movie updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Movie (Admin Only)
router.delete("/:id", authenticateAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [movie] = await pool.query("SELECT * FROM movies WHERE id = ?", [id]);
    if (movie.length === 0)
      return res.status(404).json({ message: "Movie not found" });

    await pool.query("DELETE FROM movies WHERE id = ?", [id]);
    res.json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a Specific Movie by ID
router.get("/:id", async (req, res) => {
  let { id } = req.params;
  id = parseInt(id, 10);
  if (isNaN(id)) return res.status(400).json({ message: "Invalid movie ID" });

  try {
    const [movie] = await pool.query(
      `SELECT m.*, 
              IFNULL(ROUND(AVG(r.rating), 1), 0) AS avg_rating,
              COUNT(r.id) AS total_ratings
       FROM movies m
       LEFT JOIN reviews r ON m.id = r.movie_id
       WHERE m.id = ?
       GROUP BY m.id`,
      [id]
    );

    if (movie.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Similar Movies by Genre (excluding current movie)
router.get("/:id/similar", async (req, res) => {
  const { id } = req.params;

  try {
    const [movieRows] = await pool.query(
      "SELECT genre FROM movies WHERE id = ?",
      [id]
    );
    if (movieRows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const genreString = movieRows[0].genre;
    if (!genreString) {
      return res.status(404).json({ message: "No genre data for this movie" });
    }

    const genres = genreString.split(",").map((g) => g.trim());
    const genreConditions = genres.map(() => `genre LIKE ?`).join(" OR ");
    const genreValues = genres.map((g) => `%${g}%`);

    const [similarMovies] = await pool.query(
      `SELECT * FROM movies WHERE (${genreConditions}) AND id != ? LIMIT 12`,
      [...genreValues, id]
    );

    res.json(similarMovies);
  } catch (error) {
    console.error("Error fetching similar movies:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
