const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('cookie-session');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true
}));

app.use(express.json());

// session configuration
app.use(session({
  name: 'session',
  keys: ['fc201cdef22df74efcb241a1eab230ce8d4915445bb970d7f2b04593050fbd76'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,
  sameSite: 'lax' 
}));

const dbPath = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Create users table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});


app.use('/api', authRoutes(db));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
