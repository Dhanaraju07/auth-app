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
  origin: 'https://auth-app-an81.onrender.com', 
  credentials: true
}));

app.use(express.json());

// session configuration
app.use(session({
  name: 'session',
  keys: ['a31113f95ac74d1c34a24cfe62dbdac69dbce2c3597f5a2bc38919b1bdd2c542'],
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
