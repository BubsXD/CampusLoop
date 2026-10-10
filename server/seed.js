import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, 'campusloop.db');

// Read data.json from frontend
const dataJsonPath = path.join(__dirname, '../src/data.json');
let oldData = { items: [], users: [], bookings: [] };
if (fs.existsSync(dataJsonPath)) {
  oldData = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
} else {
  console.warn('src/data.json not found. Seeding with empty base.');
}

const db = new Database(dbPath);

console.log('Rebuilding database...');

// Create Tables
db.exec(`
  DROP TABLE IF EXISTS reviews;
  DROP TABLE IF EXISTS transactions;
  DROP TABLE IF EXISTS bookings;
  DROP TABLE IF EXISTS items;
  DROP TABLE IF EXISTS users;

  CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    college TEXT NOT NULL,
    roll_no TEXT,
    phone TEXT,
    verified INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE items (
    id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT,
    price_per_day REAL NOT NULL,
    item_value REAL NOT NULL,
    condition TEXT NOT NULL,
    deposit REAL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(owner_id) REFERENCES users(id)
  );

  CREATE TABLE bookings (
    id TEXT PRIMARY KEY,
    item_id TEXT NOT NULL,
    borrower_id TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    days INTEGER NOT NULL,
    rent REAL NOT NULL,
    deposit REAL NOT NULL,
    fee REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'requested',
    agreement_accepted_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(item_id) REFERENCES items(id),
    FOREIGN KEY(borrower_id) REFERENCES users(id)
  );

  CREATE TABLE transactions (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    rent REAL NOT NULL,
    deposit REAL NOT NULL,
    fee REAL NOT NULL,
    escrow_status TEXT DEFAULT 'held',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id)
  );

  CREATE TABLE reviews (
    id TEXT PRIMARY KEY,
    booking_id TEXT NOT NULL,
    reviewer_id TEXT NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(booking_id) REFERENCES bookings(id),
    FOREIGN KEY(reviewer_id) REFERENCES users(id)
  );
`);

console.log('Tables created. Seeding fake users...');

const salt = bcrypt.genSaltSync(10);
const defaultHash = bcrypt.hashSync('demo1234', salt);

const usersToInsert = [
  { id: 'u_demo', name: 'Rujal Sharma', email: 'rujal@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_1', name: 'Aarav K.', email: 'aarav@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_2', name: 'Neha P.', email: 'neha@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_3', name: 'Omkar S.', email: 'omkar@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_4', name: 'Riya M.', email: 'riya@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_5', name: 'Sanket D.', email: 'sanket@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_6', name: 'Isha B.', email: 'isha@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_7', name: 'Kunal T.', email: 'kunal@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_8', name: 'Prachi J.', email: 'prachi@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_9', name: 'Varun G.', email: 'varun@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_10', name: 'Tanmay R.', email: 'tanmay@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_11', name: 'Aditi W.', email: 'aditi@campusloop.test', college: 'DYPIT Pimpri', verified: 1 },
  { id: 'u_12', name: 'Sarthak N.', email: 'sarthak@campusloop.test', college: 'DYPIT Pimpri', verified: 1 }
];

const insertUser = db.prepare('INSERT INTO users (id, name, email, password_hash, college, verified) VALUES (?, ?, ?, ?, ?, ?)');
usersToInsert.forEach(u => insertUser.run(u.id, u.name, u.email, defaultHash, u.college, u.verified));

console.log('Seeding fake items...');
const insertItem = db.prepare('INSERT INTO items (id, owner_id, title, category, description, price_per_day, item_value, condition, deposit, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');

const userMap = usersToInsert.reduce((acc, u) => ({...acc, [u.name]: u.id}), {});

oldData.items.forEach(item => {
  const ownerId = userMap[item.owner] || 'u_1'; // fallback
  const deposit = item.deposit !== undefined ? item.deposit : (item.value >= 5000 ? Math.round(item.value * 0.1) : 0);
  insertItem.run(`i_${item.id}`, ownerId, item.name, item.category, 'High quality ' + item.name.toLowerCase(), item.price, item.value, item.condition, deposit, item.image);
});

console.log('Seeding sample bookings...');
const insertBooking = db.prepare('INSERT INTO bookings (id, item_id, borrower_id, start_date, end_date, days, rent, deposit, fee, total, status, agreement_accepted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)');
const insertTx = db.prepare('INSERT INTO transactions (id, booking_id, rent, deposit, fee, escrow_status) VALUES (?, ?, ?, ?, ?, ?)');
const insertReview = db.prepare('INSERT INTO reviews (id, booking_id, reviewer_id, rating, comment) VALUES (?, ?, ?, ?, ?)');

// Create a Returned booking
insertBooking.run('b_1', 'i_5', 'u_demo', '2026-10-01', '2026-10-04', 3, 30, 0, 1, 31, 'returned');
insertTx.run('t_1', 'b_1', 30, 0, 1, 'released');
insertReview.run('r_1', 'b_1', 'u_demo', 5, 'Great book');

// Create an Active booking
insertBooking.run('b_2', 'i_6', 'u_demo', '2026-10-10', '2026-10-15', 5, 400, 0, 8, 408, 'active');
insertTx.run('t_2', 'b_2', 400, 0, 8, 'held');

// Create a Requested booking
insertBooking.run('b_3', 'i_2', 'u_demo', '2026-10-15', '2026-10-18', 3, 750, 3000, 15, 3765, 'requested');

console.log('Seeding complete.');
