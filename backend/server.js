const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'creative_jwt_secret_key_2026_super_secure';
const DB_PATH = path.join(__dirname, 'db.json');

app.use(cors());
// Larger limit so base64 avatar images (stored in profile.avatar) fit in the body
app.use(express.json({ limit: '5mb' }));

// Helper function to read from JSON database
function readDB() {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database file:', err);
    return { profile: {}, credentials: { username: 'designer_admin', password: 'creative_jwt_2026' }, projects: [] };
  }
}

// Helper function to write to JSON database
function writeDB(data) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing database file:', err);
    return false;
  }
}

// Ensure the default password is hashed on startup
function initDatabase() {
  const db = readDB();
  const password = db.credentials.password;
  // If the password is not yet a bcrypt hash, hash it
  if (!password.startsWith('$2a$') && !password.startsWith('$2b$')) {
    console.log('Plain text password detected. Hashing for security...');
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.credentials.password = hash;
    writeDB(db);
    console.log('Password successfully hashed and saved.');
  }
}

initDatabase();

// Middleware to verify JWT token
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Token is invalid or expired.' });
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ error: 'Authorization token required.' });
  }
}

// PUBLIC: Get all portfolio data (profile & projects)
app.get('/api/settings', (req, res) => {
  const db = readDB();
  // Don't send credentials
  const { credentials, ...publicData } = db;
  res.json(publicData);
});

// AUTH: Login
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const db = readDB();

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  if (username !== db.credentials.username) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, db.credentials.password);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  // Generate JWT token
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
  const expiresAt = Date.now() + 2 * 60 * 60 * 1000; // 2 hours from now

  res.json({
    token,
    expiresAt,
    user: { username }
  });
});

// AUTH: Verify token status
app.get('/api/auth/verify', authenticateJWT, (req, res) => {
  res.json({ valid: true, user: req.user });
});

// SECURE: Update profile settings
app.post('/api/settings/profile', authenticateJWT, (req, res) => {
  const newProfile = req.body;
  const db = readDB();

  db.profile = {
    ...db.profile,
    ...newProfile
  };

  if (writeDB(db)) {
    res.json({ success: true, message: 'Profile updated successfully.', profile: db.profile });
  } else {
    res.status(500).json({ error: 'Failed to write changes to database.' });
  }
});

// SECURE: Update projects list
app.post('/api/settings/projects', authenticateJWT, (req, res) => {
  const newProjects = req.body;
  
  if (!Array.isArray(newProjects)) {
    return res.status(400).json({ error: 'Projects data must be an array.' });
  }

  const db = readDB();
  db.projects = newProjects;

  if (writeDB(db)) {
    res.json({ success: true, message: 'Projects updated successfully.', projects: db.projects });
  } else {
    res.status(500).json({ error: 'Failed to write changes to database.' });
  }
});

// SECURE: Change admin password
app.post('/api/settings/change-password', authenticateJWT, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const db = readDB();

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  const isPasswordValid = bcrypt.compareSync(currentPassword, db.credentials.password);
  if (!isPasswordValid) {
    return res.status(400).json({ error: 'Incorrect current password.' });
  }

  const salt = bcrypt.genSaltSync(10);
  db.credentials.password = bcrypt.hashSync(newPassword, salt);

  if (writeDB(db)) {
    res.json({ success: true, message: 'Password changed successfully.' });
  } else {
    res.status(500).json({ error: 'Failed to update password.' });
  }
});

app.listen(PORT, () => {
  console.log(`Portfolio JWT Backend running on http://localhost:${PORT}`);
});
