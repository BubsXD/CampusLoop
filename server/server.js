import express from 'express';
import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'campusloop.db');
const db = new Database(dbPath);
const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const PORT = process.env.PORT || 4000;

// Simple rate limiter for login
const loginAttempts = new Map();

// Middleware to protect routes
const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'Access denied. No token provided.' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, college, roll_no, phone } = req.body;
    if (!name || !email || !password || !college || !roll_no || !phone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'User already registered.' });

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    // Auto-verify Rujal for demo purposes, others false
    const verified = email.includes('rujal') ? 1 : 0;
    
    const stmt = db.prepare('INSERT INTO users (id, name, email, password_hash, college, roll_no, phone, verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
    const id = 'u_' + Date.now();
    stmt.run(id, name, email, hash, college, roll_no, phone, verified);
    
    const token = jwt.sign({ id, email, name }, JWT_SECRET, { expiresIn: '7d' });
    const user = { id, name, email, college, roll_no, phone, verified: !!verified };
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Rate limit
    const attempts = loginAttempts.get(email) || 0;
    if (attempts >= 5) return res.status(429).json({ error: 'Too many login attempts. Try again later.' });
    
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
      loginAttempts.set(email, attempts + 1);
      setTimeout(() => loginAttempts.set(email, 0), 15 * 60 * 1000); // reset after 15 mins
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    loginAttempts.set(email, 0); // success reset
    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: '7d' });
    
    // exclude password_hash
    const { password_hash, ...userProfile } = user;
    userProfile.verified = !!userProfile.verified;
    res.json({ token, user: userProfile });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/auth/me', auth, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  const { password_hash, ...userProfile } = user;
  userProfile.verified = !!userProfile.verified;
  res.json({ user: userProfile });
});

// --- ITEMS ROUTES ---
app.get('/api/items', (req, res) => {
  let query = 'SELECT items.*, users.name as owner, users.verified as owner_verified, (SELECT AVG(rating) FROM reviews r JOIN bookings b ON r.booking_id = b.id WHERE b.item_id = items.id) as rating FROM items JOIN users ON items.owner_id = users.id WHERE 1=1';
  const params = [];
  
  if (req.query.q) {
    query += ' AND title LIKE ?';
    params.push(`%${req.query.q}%`);
  }
  if (req.query.category && req.query.category !== 'All') {
    query += ' AND category = ?';
    params.push(req.query.category);
  }
  if (req.query.verified === 'true') {
    query += ' AND users.verified = 1';
  }
  if (req.query.maxPrice) {
    query += ' AND price_per_day <= ?';
    params.push(Number(req.query.maxPrice));
  }
  
  // Custom logic for noDeposit (if value < 5000, no deposit needed implicitly in UI, but in DB we can check deposit = 0)
  if (req.query.noDeposit === 'true') {
    query += ' AND (deposit = 0 OR (deposit IS NULL AND item_value < 5000))';
  }

  const items = db.prepare(query).all(...params);
  
  // Default rating to 5.0 for demo if no reviews
  items.forEach(i => {
    i.rating = i.rating ? Number(i.rating).toFixed(1) : 5.0;
    i.verified = !!i.owner_verified;
    i.deposit = i.deposit !== null ? i.deposit : (i.item_value >= 5000 ? Math.round(i.item_value * 0.1) : 0);
  });

  // Sorting
  if (req.query.sort === 'Price low to high') items.sort((a, b) => a.price_per_day - b.price_per_day);
  else if (req.query.sort === 'Price high to low') items.sort((a, b) => b.price_per_day - a.price_per_day);
  else if (req.query.sort === 'Top rated') items.sort((a, b) => b.rating - a.rating);

  res.json(items);
});

app.get('/api/items/:id', (req, res) => {
  const item = db.prepare('SELECT items.*, users.name as owner, users.verified as owner_verified FROM items JOIN users ON items.owner_id = users.id WHERE items.id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  const avg = db.prepare('SELECT AVG(rating) as rating FROM reviews r JOIN bookings b ON r.booking_id = b.id WHERE b.item_id = ?').get(item.id);
  item.rating = avg && avg.rating ? Number(avg.rating).toFixed(1) : 5.0;
  item.verified = !!item.owner_verified;
  item.deposit = item.deposit !== null ? item.deposit : (item.item_value >= 5000 ? Math.round(item.item_value * 0.1) : 0);
  res.json(item);
});

app.post('/api/items', auth, (req, res) => {
  const { title, category, description, price_per_day, item_value, condition, image } = req.body;
  if (!title || !price_per_day || !item_value) return res.status(400).json({ error: 'Missing fields' });
  
  const id = 'i_' + Date.now();
  const stmt = db.prepare('INSERT INTO items (id, owner_id, title, category, description, price_per_day, item_value, condition, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
  stmt.run(id, req.user.id, title, category, description || '', Number(price_per_day), Number(item_value), condition || 'Good', image || '/images/casio-fx-991ex.svg');
  
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(id);
  res.status(201).json(item);
});

app.delete('/api/items/:id', auth, (req, res) => {
  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  if (item.owner_id !== req.user.id) return res.status(403).json({ error: 'Not authorized' });
  
  db.prepare('DELETE FROM items WHERE id = ?').run(item.id);
  res.json({ success: true });
});

// --- BOOKINGS ROUTES ---
app.get('/api/bookings/mine', auth, (req, res) => {
  const bookings = db.prepare(`
    SELECT b.*, i.title, i.image, i.price_per_day, u.name as owner_name 
    FROM bookings b 
    JOIN items i ON b.item_id = i.id 
    JOIN users u ON i.owner_id = u.id 
    WHERE b.borrower_id = ? 
    ORDER BY b.created_at DESC
  `).all(req.user.id);
  res.json(bookings);
});

app.post('/api/bookings', auth, (req, res) => {
  const { itemId, startDate, endDate, agreementAccepted } = req.body;
  if (!agreementAccepted) return res.status(400).json({ error: 'You must accept the rental agreement.' });
  if (!itemId || !startDate || !endDate) return res.status(400).json({ error: 'Missing booking details.' });
  
  const s = new Date(startDate);
  const e = new Date(endDate);
  if (s >= e) return res.status(400).json({ error: 'End date must be after start date.' });
  
  let days = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
  if (days < 1) days = 1;

  const item = db.prepare('SELECT * FROM items WHERE id = ?').get(itemId);
  if (!item) return res.status(404).json({ error: 'Item not found.' });
  if (item.owner_id === req.user.id) return res.status(403).json({ error: 'You cannot book your own item.' });

  // Overlap check
  const overlap = db.prepare("SELECT id FROM bookings WHERE item_id = ? AND status IN ('active', 'requested') AND (start_date <= ? AND end_date >= ?)").get(itemId, endDate, startDate);
  if (overlap) return res.status(409).json({ error: 'Item is already booked for these dates.' });

  const rent = days * item.price_per_day;
  const deposit = item.deposit !== null ? item.deposit : (item.item_value >= 5000 ? Math.round(item.item_value * 0.1) : 0);
  const fee = Math.round(rent * 0.02);
  const total = rent + deposit + fee;

  const id = 'b_' + Date.now();
  const stmt = db.prepare('INSERT INTO bookings (id, item_id, borrower_id, start_date, end_date, days, rent, deposit, fee, total, status, agreement_accepted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
  stmt.run(id, itemId, req.user.id, startDate, endDate, days, rent, deposit, fee, total, 'requested');
  
  res.status(201).json({ id, rent, deposit, fee, total, days });
});

app.post('/api/bookings/:id/pay', auth, (req, res) => {
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  if (booking.borrower_id !== req.user.id) return res.status(403).json({ error: 'Not authorized.' });
  if (booking.status !== 'requested') return res.status(400).json({ error: 'Booking is not in requested state.' });

  const txId = 't_' + Date.now();
  db.transaction(() => {
    db.prepare("INSERT INTO transactions (id, booking_id, rent, deposit, fee, escrow_status) VALUES (?, ?, ?, ?, ?, 'held')").run(txId, booking.id, booking.rent, booking.deposit, booking.fee);
    db.prepare("UPDATE bookings SET status = 'active' WHERE id = ?").run(booking.id);
  })();

  res.json({ success: true, bookingId: booking.id, status: 'active' });
});

app.patch('/api/bookings/:id/return', auth, (req, res) => {
  const booking = db.prepare('SELECT b.*, i.owner_id FROM bookings b JOIN items i ON b.item_id = i.id WHERE b.id = ?').get(req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  // Allow borrower to simulate return for demo purposes
  if (booking.borrower_id !== req.user.id && booking.owner_id !== req.user.id) return res.status(403).json({ error: 'Not authorized.' });
  
  db.transaction(() => {
    db.prepare("UPDATE bookings SET status = 'returned' WHERE id = ?").run(booking.id);
    db.prepare("UPDATE transactions SET escrow_status = 'released' WHERE booking_id = ?").run(booking.id);
  })();
  
  res.json({ success: true, status: 'returned' });
});

// --- REVIEWS ROUTES ---
app.post('/api/reviews', auth, (req, res) => {
  const { bookingId, rating, comment } = req.body;
  if (!bookingId || !rating) return res.status(400).json({ error: 'Missing review fields.' });
  if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Rating must be between 1 and 5.' });

  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(bookingId);
  if (!booking) return res.status(404).json({ error: 'Booking not found.' });
  if (booking.borrower_id !== req.user.id) return res.status(403).json({ error: 'Not authorized.' });
  if (booking.status !== 'returned') return res.status(400).json({ error: 'Item must be returned to review.' });

  const existing = db.prepare('SELECT id FROM reviews WHERE booking_id = ? AND reviewer_id = ?').get(bookingId, req.user.id);
  if (existing) return res.status(409).json({ error: 'You have already reviewed this booking.' });

  const id = 'r_' + Date.now();
  db.prepare('INSERT INTO reviews (id, booking_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?, ?)').run(id, bookingId, req.user.id, rating, comment || '');

  res.status(201).json({ success: true });
});

// --- RESET DEMO DATA ---
app.post('/api/reset', (req, res) => {
  // Can be called to rebuild db from seed
  res.json({ message: 'Use npm run seed to reset data in terminal.' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
