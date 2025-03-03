const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
app.use(express.static('public')); // Serve static files from the "public" directory

// Connect to SQLite database
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
    }
});

// **Create users table (if not exists)**
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    city TEXT NOT NULL
)`);

// **API to insert a new user**
app.post('/users', (req, res) => {
    const { username, age, city } = req.body;

    if (!username || !age || !city) {
        return res.status(400).json({ error: 'Username, age, and city are required' });
    }

    const sql = `INSERT INTO users (username, age, city) VALUES (?, ?, ?)`;
    db.run(sql, [username, age, city], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: 'User added successfully', userId: this.lastID });
    });
});

// **API to fetch all users**
app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// **API to fetch a single user by ID**
app.get('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM users WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row);
    });
});

// **API to update a user by ID**
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const { username, age, city } = req.body;

    if (!username && !age && !city) {
        return res.status(400).json({ error: 'At least one field (username, age, or city) is required for update' });
    }

    let updateFields = [];
    let values = [];

    if (username) {
        updateFields.push('username = ?');
        values.push(username);
    }
    if (age) {
        updateFields.push('age = ?');
        values.push(age);
    }
    if (city) {
        updateFields.push('city = ?');
        values.push(city);
    }

    values.push(id);
    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;

    db.run(sql, values, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User updated successfully' });
    });
});

// **API to delete a user by ID**
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM users WHERE id = ?';

    db.run(sql, [id], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ message: 'User deleted successfully' });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
