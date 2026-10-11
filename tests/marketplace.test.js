import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_USERS, createBooking, createItem, daysInclusive, makeInitialState, rateBooking, setItemAvailability, today, updateBooking, upgradeState } from '../src/lib/marketplace.js';

const futureDate = offset => {
  const date = new Date(today() + 'T12:00:00Z');
  date.setUTCDate(date.getUTCDate() + offset);
  return date.toISOString().slice(0, 10);
};

test('demo profiles match the project team and migrate saved listings', () => {
  assert.deepEqual(DEMO_USERS.map(({ name, rollNumber }) => [name, rollNumber]), [
    ['Rujal Sharma', 'C-25'],
    ['Sudhanshu Pendalwar', 'C-46'],
    ['Shlok Mishra', 'C-60'],
    ['Vansh Jain', 'C-61'],
  ]);
  assert.ok(DEMO_USERS.every(user => user.course === 'AI & Data Science'));
  const state = makeInitialState();
  const old = { ...state, version: 3, items: state.items.map(item => ({ ...item, owner: 'Old demo name' })) };
  const migrated = upgradeState(old);
  assert.equal(migrated.bookings, old.bookings);
  assert.equal(migrated.items.find(item => item.id === '1').owner, 'Sudhanshu Pendalwar');
  assert.equal(migrated.version, 4);
});

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
