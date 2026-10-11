# CampusLoop

A responsive demo of a student-to-student rental marketplace for the DYPIT Pimpri campus. Students can discover shared gear, request rental dates, list their own items, review incoming requests, confirm returns, and rate completed rentals.

This is a **showcase demo**. It uses sample student profiles and catalog data. Changes are saved in the current browser with `localStorage`; students on different devices do not share state. There are no accounts, identity checks, payment processing, escrow, or database.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```bash
npm ci
npm run dev
```

Open the address printed by Vite, usually `http://localhost:5173`.

```bash
npm test
npm run lint
npm run build
```

## Try the complete demo flow

1. Browse a listing owned by another student and choose dates.
2. Accept the sharing terms and send a request. The estimated rent is shown, but no payment is collected.
3. Open **Demo profile** and switch to the item's owner.
4. Open **My rentals → Lending** to confirm or decline the request.
5. Switch back to the borrower and request a return from **My rentals → Borrowing**.
6. Switch to the owner to confirm the return; the borrower can then rate the completed rental.

The app prevents requests for your own item, periods longer than 30 days, and overlapping active requests. Owners can pause listings when no active requests remain. **Reset demo** restores the original sample state.

## Structure

- `src/App.jsx` — screens and interactions
- `src/styles.css` — responsive design system
- `src/lib/marketplace.js` — demo state, validation, pricing and booking transitions
- `src/data.json` — sample catalog
- `tests/marketplace.test.js` — core flow tests

CampusLoop began as a Community Engagement Project at Dr. D. Y. Patil Institute of Technology, Pimpri, Pune (Department of AI & Data Science).
