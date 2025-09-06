const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

function authRoutes(db) {
  router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    try {
      db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }
        
        if (row) {
          return res.status(400).json({ error: 'User already exists' });
        }
        
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, hashedPassword], function(err) {
          if (err) {
            return res.status(500).json({ error: 'Failed to create user' });
          }
          
          req.session.userId = this.lastID;
          res.status(201).json({ message: 'User created successfully' });
        });
      });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  });

  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
      
      req.session.userId = user.id;
      res.json({ message: 'Logged in successfully' });
    });
  });

  router.post('/logout', (req, res) => {
    req.session = null;
    res.json({ message: 'Logged out successfully' });
  });

  router.get('/user', (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    
    db.get('SELECT id, email FROM users WHERE id = ?', [req.session.userId], (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (!user) {
        req.session = null; 
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.json(user);
    });
  });

  return router;
}

module.exports = authRoutes;
