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
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

app.use('/uploads', express.static('uploads'));


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
      `SELECT YEAR(year) as date, genre, COUNT(*) AS count
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
//get all artworks
app.get("/api/artworks", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM artworks ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
// Update artwork rating
app.patch('/api/artworks/:id', async (req, res) => {
  const id = req.params.id;
  const { rating } = req.body;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ success: false, error: 'Invalid ID' });
  }

  const parsedRating = Number(rating);
  if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
    return res.status(400).json({
      success: false,
      error: 'Invalid rating. Must be an integer between 1 and 5.',
    });
  }

  try {
    const [result] = await pool.query('UPDATE artworks SET rating = ? WHERE id = ?', [
      parsedRating,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Artwork not found' });
    }

    const [updatedRows] = await pool.query('SELECT * FROM artworks WHERE id = ?', [id]);
    const art = updatedRows[0];
    art.image_url = parseImageUrls(art.image_url);
    res.json(art);
  } catch (err) {
    console.error('Error updating rating:', err);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});
//delete
 app.delete("/api/artworks/:id", async (req, res) => {
    const id = req.params.id;

    try {
      // Get image URL
      const [rows] = await pool.query("SELECT image_url FROM artworks WHERE id = ?", [id]);
      const image_url = rows[0]?.image_url;

      // Delete artwork
      await pool.query("DELETE FROM artworks WHERE id = ?", [id]);

      // Delete image file if it exists
      if (image_url) {
        fs.unlink(path.join(__dirname, image_url), (err) => {
          if (err) console.warn("Image deletion failed:", err.message);
        });
      }

      res.json({ message: "Artwork deleted successfully" });
    } catch (err) {
      console.error("Delete error:", err);
      res.status(500).json({ message: "Failed to delete artwork" });
    }
  });

// Get artwork by ID
app.get('/api/artworks/:id', async (req, res) => {
   

  const id = req.params.id;
  if (!/^\d+$/.test(id)) {
    return res.status(400).json({ success: false, error: 'Invalid ID' });
  }
  try {
    const [rows] = await pool.query('SELECT * FROM artworks WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Artwork not found' });
    }
    const art = rows[0];
    //art.image_url = parseImageUrls(art.image_url);

    res.json(art);
  } catch (err) {
  console.error('Error fetching artwork:', err);
  res.status(500).json({ success: false, error: 'Internal server error' });
}

});
// Add new artwork
app.post('/api/artworks', async (req, res) => {
  const { title, artist, genre, year, rating, description, image_url } = req.body;

  if (!title || !artist || !image_url) {
    return res.status(400).json({ success: false, error: 'Title, artist, and image_url are required' });
  }

  const imagesToStore = Array.isArray(image_url) ? JSON.stringify(image_url) : image_url;

  try {
    const [result] = await pool.query(
      `INSERT INTO artworks (title, artist, genre, year, rating, description, image_url)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, artist, genre || null, year || null, rating || null, description || null, imagesToStore]
    );
    res.json({ success: true, id: result.insertId });
  } catch (err) {
    console.error('Error inserting artwork:', err);
    res.status(500).json({ success: false, error: 'Failed to save artwork' });
  }
});
// Upload an image
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }
  const imageUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, imageUrl });
});
//update
 app.put("/api/artworks/:id", upload.single("image"), async (req, res) => {
    const { title, artist, genre, description, year, rating } = req.body;
    const id = req.params.id;

    try {
      let image_url = null;

      // Get old image URL
      const [rows] = await pool.query("SELECT image_url FROM artworks WHERE id = ?", [id]);
      image_url = rows[0]?.image_url || null;

      // Delete old image if new one is uploaded
      if (req.file) {
        if (image_url) {
          fs.unlink(path.join(__dirname, image_url), (err) => {
            if (err) console.error("Failed to delete old image:", err);
          });
        }
        image_url = `/uploads/${req.file.filename}`;
      }

      const sql = `
        UPDATE artworks 
        SET title = ?, artist = ?, genre = ?, description = ?, year = ?, rating = ?, image_url = ?
        WHERE id = ?
      `;
      const values = [title, artist, genre, description, year, rating, image_url, id];
      await pool.query(sql, values);

      res.json({ message: "Artwork updated successfully" });
    } catch (err) {
      console.error("Update error:", err);
      res.status(500).json({ message: "Server error during update" });
    }
  });
  // ✅ Search Endpoint: GET /artworks/search?query=...
app.get('/search', (req, res) => {
  const searchTerm = req.query.q;

  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  const q = `
    SELECT * FROM artworks
    WHERE LOWER(title) LIKE ? OR LOWER(artist) LIKE ?
  `;
  const term = `%${searchTerm.toLowerCase()}%`;

  db.query(q, [term, term], (err, data) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(data);
  });
});




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
