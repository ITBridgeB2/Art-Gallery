const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'artgallery',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// 1. Genre Popularity (total count of artworks by genre)
app.get('/api/analytics/genre-popularity', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT genre, COUNT(*) AS count FROM artworks GROUP BY genre ORDER BY count DESC`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 2. Year-wise Genre Popularity
app.get('/api/analytics/year-wise', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT YEAR(created_date) as year, genre, COUNT(*) AS count
       FROM artworks
       GROUP BY year, genre
       ORDER BY year, genre`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// 3. Age-wise Genre Popularity (using comments join artworks)
app.get('/api/analytics/age-genre', async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT c.age, a.genre, COUNT(*) AS count
       FROM comments c
       JOIN artworks a ON c.artwork_id = a.id
       GROUP BY c.age, a.genre
       ORDER BY c.age, a.genre`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
