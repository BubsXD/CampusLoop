import test from 'node:test';
import assert from 'node:assert/strict';
import { createBooking, createItem, daysInclusive, makeInitialState, rateBooking, setItemAvailability, today, updateBooking } from '../src/lib/marketplace.js';

const futureDate = offset => {
  const date = new Date(today() + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

test('rental days are inclusive and reject a reversed range', () => {
  assert.equal(daysInclusive('2026-10-12', '2026-10-14'), 3);
  assert.equal(daysInclusive('2026-10-14', '2026-10-12'), 0);
});

test('booking requests calculate rent and protect occupied dates', () => {
  const state = makeInitialState();
  const requested = createBooking(state, { itemId: '1', renterId: 'u1', startDate: futureDate(7), endDate: futureDate(9) });
  assert.equal(requested.bookings[0].rent, 60);
  assert.equal(requested.bookings[0].days, 3);
  assert.equal(requested.bookings[0].status, 'Pending');
  assert.throws(() => createBooking(requested, { itemId: '1', renterId: 'u3', startDate: futureDate(8), endDate: futureDate(10) }), /overlap/);
  assert.throws(() => createBooking(state, { itemId: '12', renterId: 'u1', startDate: futureDate(8), endDate: futureDate(9) }), /own item/);
});

test('only the owner can confirm and complete a return', () => {
  const state = makeInitialState();
  const bookingId = 'CL-2409';
  assert.throws(() => updateBooking(state, bookingId, 'Confirmed', 'u3'), /not available/);
  const confirmed = updateBooking(state, bookingId, 'Confirmed', 'u1');
  assert.equal(confirmed.bookings.find(booking => booking.id === bookingId).status, 'Confirmed');
  const returning = updateBooking(confirmed, bookingId, 'Return requested', 'u3');
  assert.throws(() => updateBooking(returning, bookingId, 'Completed', 'u3'), /not available/);
  const completed = updateBooking(returning, bookingId, 'Completed', 'u1');
  const rated = rateBooking(completed, bookingId, 'u3', 4);
  assert.equal(rated.bookings.find(booking => booking.id === bookingId).rating, 4);
  assert.throws(() => rateBooking(rated, bookingId, 'u3', 5), /not available/);
});

test('listing validation and active request protection', () => {
  const state = makeInitialState();
  assert.throws(() => createItem(state, 'u1', { name: 'A', description: 'Short', category: 'Lab', condition: 'Good', price: 20, value: 200 }), /title/);
  const next = createItem(state, 'u1', { name: 'Spare calculator', description: 'Ready for exams with spare batteries.', category: 'Lab', condition: 'Good', price: 20, value: 1200 });
  assert.equal(next.items[0].ownerId, 'u1');
  assert.throws(() => setItemAvailability(state, '12', 'u1', false), /active requests/);
  const paused = setItemAvailability(next, next.items[0].id, 'u1', false);
  assert.equal(paused.items[0].available, false);
});
