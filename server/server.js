// require("dotenv").config();
// const express = require("express");
// const mysql = require("mysql2/promise");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve uploaded images
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Ensure uploads directory exists
// if (!fs.existsSync(path.join(__dirname, "uploads"))) {
//   fs.mkdirSync(path.join(__dirname, "uploads"));
// }

// // MySQL connection
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // Multer config for file uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "uploads"));
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = Date.now() + "-" + file.originalname;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // GET artworks
// app.get("/api/artworks", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM artworks ORDER BY created_at DESC");
//     res.json(rows);
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).json({ error: "Server error." });
//   }
// });

// // POST artwork with image upload
// app.post("/api/artworks", upload.single("image"), async (req, res) => {
//   try {
//     const { title, artist, genre, description, is_popular } = req.body;
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//     const query = `
//       INSERT INTO artworks (title, artist, genre, description, is_popular, image_url, created_date)
//       VALUES (?, ?, ?, ?, ?, ?, CURDATE())
//     `;
//     const values = [title, artist, genre, description, is_popular ? 1 : 0, imageUrl];

//     const [result] = await pool.query(query, values);
//     res.status(201).json({ message: "Artwork added", id: result.insertId });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Failed to upload artwork." });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });












// require("dotenv").config();
// const express = require("express");
// const mysql = require("mysql2/promise");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Serve uploaded images statically
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Ensure uploads folder exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // MySQL connection
// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
// });

// // Multer setup
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueName = `${Date.now()}-${file.originalname}`;
//     cb(null, uniqueName);
//   },
// });
// const upload = multer({ storage });

// // GET all artworks
// app.get("/api/artworks", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM artworks ORDER BY created_at DESC");
//     res.json(rows);
//   } catch (err) {
//     console.error("Database error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // GET single artwork by ID (for detail page)
// app.get("/api/artworks/:id", async (req, res) => {
//   try {
//     const [rows] = await pool.query("SELECT * FROM artworks WHERE id = ?", [req.params.id]);
//     if (rows.length === 0) {
//       return res.status(404).json({ error: "Artwork not found" });
//     }
//     res.json(rows[0]);
//   } catch (err) {
//     console.error("Detail error:", err);
//     res.status(500).json({ error: "Failed to fetch artwork" });
//   }
// });

// // POST new artwork
// app.post("/api/artworks", upload.single("image"), async (req, res) => {
//   try {
//     const { title, artist, genre, description, is_popular } = req.body;
//     const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

//     const query = `
//       INSERT INTO artworks (title, artist, genre, description, is_popular, image_url, created_at)
//       VALUES (?, ?, ?, ?, ?, ?, NOW())
//     `;
//     const values = [title, artist, genre, description, is_popular ? 1 : 0, imageUrl];

//     const [result] = await pool.query(query, values);
//     res.status(201).json({ message: "Artwork added", id: result.insertId });
//   } catch (err) {
//     console.error("Upload error:", err);
//     res.status(500).json({ error: "Failed to upload artwork" });
//   }
// });

// // Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`✅ Server running at http://localhost:${PORT}`);
// });









  require("dotenv").config();
  const express = require("express");
  const mysql = require("mysql2/promise");
  const cors = require("cors");
  const multer = require("multer");
  const path = require("path");
  const fs = require("fs");

  const app = express();
  app.use(cors());
  app.use(express.json());

  // Ensure uploads folder exists
  const uploadDir = path.join(__dirname, "uploads");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  // Serve uploaded images statically
  app.use("/uploads", express.static(uploadDir));

  // MySQL connection pool
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  // Multer setup for image upload
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}${ext}`);
    },
  });
  const upload = multer({ storage });

  /**
   * GET all artworks
   */
  app.get("/api/artworks", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM artworks ORDER BY created_at DESC");
      res.json(rows);
    } catch (err) {
      console.error("Database error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  /**
   * GET single artwork by ID
   */
  app.get("/api/artworks/:id", async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM artworks WHERE id = ?", [req.params.id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: "Artwork not found" });
      }
      res.json(rows[0]);
    } catch (err) {
      console.error("Detail error:", err);
      res.status(500).json({ error: "Failed to fetch artwork" });
    }
  });

  /**
   * POST new artwork
   */
  app.post("/api/artworks", upload.single("image"), async (req, res) => {
    try {
      const { title, artist, genre, description, is_popular } = req.body;
      const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

      const query = `
        INSERT INTO artworks (title, artist, genre, description, is_popular, image_url, created_at)
        VALUES (?, ?, ?, ?, ?, ?, NOW())
      `;
      const values = [title, artist, genre, description, is_popular ? 1 : 0, imageUrl];

      const [result] = await pool.query(query, values);
      res.status(201).json({ message: "Artwork added", id: result.insertId });
    } catch (err) {
      console.error("Upload error:", err);
      res.status(500).json({ error: "Failed to upload artwork" });
    }
  });

  /**
   * PUT (Update) artwork
   */
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

  /**
   * DELETE artwork
   */
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

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
  });
