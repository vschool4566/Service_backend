const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get('/hello', (req, res) => {
    res.send("Hello World");
});

app.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, email, phoneNumber, password } = req.body;

        if (!firstname || !lastname || !email || !phoneNumber || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const query = `
            INSERT INTO users (firstname, lastname, email, phone_number, password)
            VALUES ($1, $2, $3, $4, $5) RETURNING *
        `;
        const values = [firstname, lastname, email, phoneNumber, password];

        const result = await pool.query(query, values);
        const newUser = result.rows[0];

        res.status(201).json({ message: "User registered successfully", user: newUser });

    } catch (error) {
        console.error("Error during sign-up:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(8000, () => {
    console.log("Server is running on port 8000");
});
