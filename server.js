const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// Directly add your Render PostgreSQL URL here
const pool = new Pool({
    connectionString: "postgresql://renderdb_s2aj_user:hrkmhew974avTg5vj3xtB9ehkDret2BO@dpg-cv62amqn91rc73baf7g0-a.oregon-postgres.render.com/renderdb_s2aj",
    ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(bodyParser.json());

// Fetch places by district
app.get('/places/:district', async (req, res) => {
    try {
        const { district } = req.params;
        const result = await pool.query('SELECT * FROM places WHERE district = $1', [district]);
        res.json(result.rows.length ? result.rows : { message: "No data available" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a new place
app.post('/places', async (req, res) => {
    try {
        const { district, name, description, image_url } = req.body;
        await pool.query(
            'INSERT INTO places (district, name, description, image_url) VALUES ($1, $2, $3, $4)', 
            [district, name, description, image_url || null]
        );
        res.json({ message: 'Place added successfully!' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
