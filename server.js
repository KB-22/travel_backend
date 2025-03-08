const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL Database Connection
const pool = new Pool({
  connectionString: "postgresql://renderdb_s2aj_user:hrkmhew974avTg5vj3xtB9ehkDret2BO@dpg-cv62amqn91rc73baf7g0-a.oregon-postgres.render.com/renderdb_s2aj",
  ssl: {
    rejectUnauthorized: false,
  },
});

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Travel API!");
});

// Get all districts
app.get("/districts", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM districts");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all places
app.get("/places", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM places");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get places by district
app.get("/places/:district_id", async (req, res) => {
  try {
    const { district_id } = req.params;
    const result = await pool.query("SELECT * FROM places WHERE district_id = $1", [district_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No places found for this district." });
    }
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new place (POST request)
app.post("/places", async (req, res) => {
  try {
    const { name, description, image_url, district_id } = req.body;
    const result = await pool.query(
      "INSERT INTO places (name, description, image_url, district_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, image_url, district_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the Server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
