# Campus Loop

A closed-network peer-to-peer rental marketplace for university students. "Rent it. Return it. Loop it."

## Tech Stack
- **Frontend**: React + Vite
- **Styling**: Vanilla CSS (Nord Dark Theme)
- **Backend**: Node.js + Express
- **Database**: SQLite (better-sqlite3)
- **Auth**: JWT & bcryptjs

## Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment**
   Copy `.env.example` to `.env` in the `server` directory (or just use the default fallback).
   ```bash
   cp server/.env.example server/.env
   ```

3. **Seed the database**
   This creates the SQLite database and populates it with test users, items, and bookings.
   ```bash
   npm run seed
   ```

4. **Start the application**
   This concurrently runs the Vite frontend (port 5173) and the Express backend (port 4000).
   ```bash
   npm run dev
   ```

## Demo Login
- **Email**: rujal@campusloop.test
- **Password**: demo1234

## API Endpoints

### Auth
- `POST /api/auth/register` - Create a new user
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Get current user profile (Requires token)

### Items
- `GET /api/items` - List items (supports filters: `q`, `category`, `sort`, `verified`, `noDeposit`, `maxPrice`)
- `GET /api/items/:id` - Get single item details
- `POST /api/items` - Create a new item listing (Requires token)
- `DELETE /api/items/:id` - Delete an item (Requires token, owner only)

### Bookings & Transactions
- `POST /api/bookings` - Create a new booking (Requires token, checks overlap/ownership)
- `GET /api/bookings/mine` - List bookings for the authenticated user (Requires token)
- `POST /api/bookings/:id/pay` - Simulate payment and activate booking (Requires token, borrower only)
- `PATCH /api/bookings/:id/return` - Mark booking as returned and release escrow (Requires token)

### Reviews
- `POST /api/reviews` - Rate and review a returned booking (Requires token, borrower only)
