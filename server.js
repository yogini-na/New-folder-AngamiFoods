/**
 * Angami Foods — Local Development Server
 * Stack : Express + JSON file-based DB + password-protected admin dashboard
 * Run   : node server.js
 * Site  : http://localhost:3000
 * Admin : http://localhost:3000/admin
 */

const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const crypto  = require('crypto');          // built-in – no install needed

const app  = express();
const PORT = 3000;

// ─── Config ──────────────────────────────────────────────────────────────────

const ADMIN_PASSWORD = 'Yogini@123';
const TOKEN_SECRET   = crypto.randomBytes(32).toString('hex'); // rotates on restart

// Active tokens: Map<token, expiresAt>
const activeSessions = new Map();

function generateToken() {
  return crypto.randomBytes(24).toString('hex');
}
function isValidToken(token) {
  if (!token || !activeSessions.has(token)) return false;
  if (Date.now() > activeSessions.get(token)) {
    activeSessions.delete(token);
    return false;
  }
  return true;
}

// ─── JSON "Database" ─────────────────────────────────────────────────────────

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE  = path.join(DATA_DIR, 'inquiries.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB_FILE))  fs.writeFileSync(DB_FILE, '[]');

function readDB()      { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function writeDB(data) { fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2)); }

console.log('✅ JSON database ready → data/inquiries.json');

// ─── Middleware ───────────────────────────────────────────────────────────────

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname, { index: 'index.html' }));

// Auth middleware for protected API routes
function requireAuth(req, res, next) {
  const token = req.headers['x-admin-token'] || req.query.token;
  if (!isValidToken(token)) {
    return res.status(401).json({ error: 'Unauthorized. Please log in at /admin' });
  }
  next();
}

// ─── Admin Auth API ───────────────────────────────────────────────────────────

// POST /admin/login — verify password, return session token
app.post('/admin/login', (req, res) => {
  const { password } = req.body;
  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Incorrect password.' });
  }
  const token     = generateToken();
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000; // 8 hours
  activeSessions.set(token, expiresAt);
  console.log(`🔐 Admin login — session created (expires in 8h)`);
  res.json({ success: true, token });
});

// POST /admin/logout
app.post('/admin/logout', (req, res) => {
  const token = req.headers['x-admin-token'];
  if (token) activeSessions.delete(token);
  res.json({ success: true });
});

// ─── Public Contact Form API ──────────────────────────────────────────────────

// POST /api/inquiries — save a contact form submission (public)
app.post('/api/inquiries', (req, res) => {
  const { name, email, company, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'name, email and message are required.' });
  }
  const inquiries = readDB();
  const entry = {
    id:         inquiries.length ? Math.max(...inquiries.map(i => i.id)) + 1 : 1,
    name,
    email,
    company:    company || '',
    message,
    created_at: new Date().toISOString(),
    read:       false
  };
  inquiries.push(entry);
  writeDB(inquiries);
  console.log(`📩 Inquiry #${entry.id} — ${name} <${email}>`);
  res.status(201).json({ success: true, id: entry.id });
});

// ─── Protected Admin API ──────────────────────────────────────────────────────

// GET /api/admin/inquiries — list all (newest first)
app.get('/api/admin/inquiries', requireAuth, (req, res) => {
  const inquiries = readDB();
  res.json([...inquiries].reverse());
});

// PATCH /api/admin/inquiries/:id/read — mark as read
app.patch('/api/admin/inquiries/:id/read', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  const inquiries = readDB();
  const entry = inquiries.find(i => i.id === id);
  if (!entry) return res.status(404).json({ error: 'Not found.' });
  entry.read = true;
  writeDB(inquiries);
  res.json({ success: true });
});

// DELETE /api/admin/inquiries/:id — delete one
app.delete('/api/admin/inquiries/:id', requireAuth, (req, res) => {
  const id = parseInt(req.params.id);
  let inquiries = readDB();
  const before = inquiries.length;
  inquiries = inquiries.filter(i => i.id !== id);
  if (inquiries.length === before) return res.status(404).json({ error: 'Not found.' });
  writeDB(inquiries);
  console.log(`🗑️  Inquiry #${id} deleted by admin`);
  res.json({ success: true });
});

// ─── Admin SPA ────────────────────────────────────────────────────────────────

// GET /admin — serve the admin dashboard HTML
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀  Angami Foods is running!`);
  console.log(`\n   🌐  Site :   http://localhost:${PORT}`);
  console.log(`   🔒  Admin:   http://localhost:${PORT}/admin`);
  console.log(`   📁  DB   :   data/inquiries.json`);
  console.log('\n   Press Ctrl+C to stop.\n');
});
