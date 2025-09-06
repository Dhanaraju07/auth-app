
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const session = require('cookie-session');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

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
  keys: [process.env.SESSION_SECRET || 'dev-secret-key'],
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  httpOnly: true,
  sameSite: 'lax'
}));

const dbDir = path.join(__dirname, 'data');
const dbPath = path.join(dbDir, 'database.sqlite');


if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database:', err.message);
  } else {
    console.log('Connected to SQLite database at', dbPath);
  }
});

// Create users table if it doesn’t exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT
  )`);
});

// Routes
app.use('/api', authRoutes(db));


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
