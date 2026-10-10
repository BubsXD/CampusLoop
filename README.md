# Campus Loop

A closed-network, peer-to-peer rental marketplace for university students. Students rent items they rarely use (calculators, cameras, cycles, books) to verified students on the same campus, instead of everyone buying new.

Built as a Community Engagement Project (CEP) at Dr. D. Y. Patil Institute of Technology, Pimpri, Pune (Dept. of AI & Data Science).

## Problem
Students buy costly items for short, one-time use and leave them unused. Classifieds apps and chat groups have no verification, rental agreement or deposit protection. Campus Loop gives students a safe, low-cost way to rent instead of buy, which also reduces waste.

## Features
- **Home:** landing page with categories, popular items, recently listed items and active rentals
- **Search:** live search, category chips, sorting and filters (verified only, no deposit, price)
- **Item details:** picture, condition, item value, refundable deposit and owner rating
- **Booking and agreement:** date selection and a standard online rental agreement that must be accepted before payment
- **Payment (simulated):** rent, refundable deposit and 2% platform fee, held in escrow. No real money is charged
- **Rentals and profile:** booking status, return flow with deposit release and ratings, and a verified-student profile
- **Nord dark theme** with a responsive layout for phone, tablet and desktop
- **Offline storage:** uses `localStorage`, so data survives a refresh

## How it works
1. A verified student lists an item with price and condition.
2. A borrower searches, books dates and accepts the rental agreement.
3. The borrower pays rent plus a deposit for costly items. The platform fee is 2% of the rent.
4. After the item is returned, the rent is released to the owner and the deposit goes back to the borrower.

## Tech stack
- React
- Vite
- Lucide React (icons)
- Local `data.json` with sample data, no backend
- Simulated payments

## How to run
1. Make sure you have Node.js installed.
2. Clone the repo and install dependencies:
```bash
   git clone https://github.com/BubsXD/campus-loop.git
   cd campus-loop
   npm install
```
3. Start the development server:
```bash
   npm run dev
```
4. Open http://localhost:5173 in your browser.

## Team
- Rujal Sharma (C-25)
- Sudhanshu Pendalwar (C-46)
- Shlok Mishra (C-60)
- Vansh Jain (C-61)

Project Guide: Prof. Ifrah Sutar

## Notes
All items, users and bookings are fake sample data for demonstration. Planned next steps: real payment gateway, automated ID verification, mobile app and support for more campuses.