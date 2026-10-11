import seed from '../data.json' with { type: 'json' };

export const STORAGE_KEY = 'campusloop-demo-v3';
export const CATEGORIES = ['All', 'Electronics', 'Lab', 'Books', 'Cycles'];
export const CONDITIONS = ['Like new', 'Good', 'Fair'];
export const DEMO_USERS = [
  { id: 'u1', name: 'Rujal Sharma', initials: 'RS', rollNumber: 'C-25', course: 'AI & Data Science', year: 'Second year', campus: 'DYPIT Pimpri' },
  { id: 'u2', name: 'Sudhanshu Pendalwar', initials: 'SP', rollNumber: 'C-46', course: 'AI & Data Science', year: 'Second year', campus: 'DYPIT Pimpri' },
  { id: 'u3', name: 'Shlok Mishra', initials: 'SM', rollNumber: 'C-60', course: 'AI & Data Science', year: 'Second year', campus: 'DYPIT Pimpri' },
  { id: 'u4', name: 'Vansh Jain', initials: 'VJ', rollNumber: 'C-61', course: 'AI & Data Science', year: 'Second year', campus: 'DYPIT Pimpri' },
];

const addDays = (date, days) => {
  const next = new Date(`${date}T12:00:00Z`);
  next.setUTCDate(next.getUTCDate() + days);
  return next.toISOString().slice(0, 10);
};

export const today = () => new Date().toLocaleDateString('en-CA');

export function daysInclusive(start, end) {
  const first = Date.parse(`${start}T12:00:00Z`);
  const last = Date.parse(`${end}T12:00:00Z`);
  if (!Number.isFinite(first) || !Number.isFinite(last) || last < first) return 0;
  return Math.round((last - first) / 86400000) + 1;
}

export function makeInitialState() {
  const base = today();
  const users = DEMO_USERS;
  const ownerIds = ['u2', 'u3', 'u2', 'u4', 'u3', 'u4', 'u2', 'u3', 'u2', 'u4', 'u3', 'u1'];
  const descriptions = [
    'Reliable calculator for exams and lab sessions. Includes the original case and fresh batteries.',
    'Capture your next event or project with this easy-to-use DSLR. Lens, strap and charger included.',
    'Complete drafter set with all the essentials for drawing sheets and studio work.',
    'Comfortable city cycle, ideal for getting around campus and nearby neighborhoods.',
    'A well-kept copy with useful notes for quick revision before exams.',
    'Everything you need to prototype your next idea, packed neatly in one kit.',
    'Portable speaker with clear sound and a long-lasting battery.',
    'Clean, comfortable lab coat ready for practical sessions.',
    'Exam-ready Casio calculator with cover and fresh batteries.',
    'Sturdy mountain bike for rides around campus and beyond.',
    'A practical reference for assignments and interview preparation.',
    'Bright ring light and adjustable tripod for shoots, presentations and video calls.',
  ];
  const items = seed.items.map((item, index) => ({
    ...item,
    ownerId: ownerIds[index],
    owner: users.find(user => user.id === ownerIds[index]).name,
    description: descriptions[index],
    available: true,
    createdAt: addDays(base, -index),
  }));
  const bookings = [
    { id: 'CL-2408', itemId: '6', renterId: 'u1', startDate: addDays(base, 2), endDate: addDays(base, 4), days: 3, rent: 240, status: 'Confirmed', createdAt: addDays(base, -2) },
    { id: 'CL-2409', itemId: '12', renterId: 'u3', startDate: addDays(base, 5), endDate: addDays(base, 6), days: 2, rent: 120, status: 'Pending', createdAt: addDays(base, -1) },
    { id: 'CL-2392', itemId: '5', renterId: 'u1', startDate: addDays(base, -9), endDate: addDays(base, -7), days: 3, rent: 30, status: 'Completed', createdAt: addDays(base, -14), rating: 5 },
  ];
  return { version: 4, currentUserId: 'u1', users, items, bookings };
}

export function upgradeState(state) {
  if (![3, 4].includes(state?.version) || !Array.isArray(state.items) || !Array.isArray(state.bookings) || !Array.isArray(state.users)) return null;
  return {
    ...state,
    version: 4,
    users: DEMO_USERS,
    items: state.items.map(item => {
      const owner = DEMO_USERS.find(user => user.id === item.ownerId);
      return owner ? { ...item, owner: owner.name } : item;
    }),
  };
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = upgradeState(JSON.parse(raw));
      if (state) return state;
    }
  } catch { /* Reset damaged demo data. */ }
  return makeInitialState();
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function isUnavailable(bookings, itemId, startDate, endDate) {
  return bookings.some(booking => booking.itemId === itemId && ['Pending', 'Confirmed', 'Return requested'].includes(booking.status) &&
    startDate <= booking.endDate && endDate >= booking.startDate);
}

export function createBooking(state, { itemId, renterId, startDate, endDate }) {
  const item = state.items.find(entry => entry.id === itemId);
  const days = daysInclusive(startDate, endDate);
  if (!item || !item.available) throw new Error('This item is unavailable.');
  if (!state.users.some(user => user.id === renterId)) throw new Error('Choose a demo profile first.');
  if (item.ownerId === renterId) throw new Error('You cannot book your own item.');
  if (startDate < today() || days < 1 || days > 30) throw new Error('Choose a future rental period of up to 30 days.');
  if (isUnavailable(state.bookings, itemId, startDate, endDate)) throw new Error('Those dates overlap another request. Try different dates.');
  const booking = {
    id: `CL-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    itemId, renterId, startDate, endDate, days, rent: days * item.price,
    status: 'Pending', createdAt: new Date().toISOString(),
  };
  return { ...state, bookings: [booking, ...state.bookings] };
}

const transitions = {
  Pending: { Confirmed: 'owner', Declined: 'owner', Cancelled: 'renter' },
  Confirmed: { 'Return requested': 'renter', Cancelled: 'owner' },
  'Return requested': { Completed: 'owner' },
};

export function updateBooking(state, bookingId, status, actorId) {
  const booking = state.bookings.find(entry => entry.id === bookingId);
  const item = booking && state.items.find(entry => entry.id === booking.itemId);
  const role = booking && item && (actorId === item.ownerId ? 'owner' : actorId === booking.renterId ? 'renter' : null);
  if (!booking || !role || transitions[booking.status]?.[status] !== role) throw new Error('This booking action is not available.');
  return { ...state, bookings: state.bookings.map(entry => entry.id === bookingId ? { ...entry, status } : entry) };
}

export function createItem(state, ownerId, values) {
  const name = values.name?.trim();
  const description = values.description?.trim();
  const price = Number(values.price);
  const value = Number(values.value);
  if (!state.users.some(user => user.id === ownerId)) throw new Error('Choose a demo profile first.');
  if (!name || name.length < 4 || name.length > 80) throw new Error('Add a title between 4 and 80 characters.');
  if (!description || description.length < 12 || description.length > 500) throw new Error('Add a description between 12 and 500 characters.');
  if (!CATEGORIES.slice(1).includes(values.category) || !CONDITIONS.includes(values.condition)) throw new Error('Choose a category and condition.');
  if (!Number.isInteger(price) || price < 1 || price > 10000 || !Number.isInteger(value) || value < price || value > 1000000) throw new Error('Enter valid prices in rupees.');
  const owner = state.users.find(user => user.id === ownerId);
  const image = {
    Electronics: '/images/bluetooth-speaker.svg', Lab: '/images/scientific-calculator.svg',
    Books: '/images/data-structures-textbook.svg', Cycles: '/images/city-cycle.svg',
  }[values.category];
  const item = { id: crypto.randomUUID(), name, description, category: values.category, condition: values.condition,
    price, value, deposit: 0, ownerId, owner: owner.name, image, rating: null, available: true, createdAt: new Date().toISOString() };
  return { ...state, items: [item, ...state.items] };
}

export function setItemAvailability(state, itemId, actorId, available) {
  const item = state.items.find(entry => entry.id === itemId);
  if (!item || item.ownerId !== actorId) throw new Error('You can only edit your own listings.');
  if (!available && state.bookings.some(booking => booking.itemId === itemId && ['Pending', 'Confirmed', 'Return requested'].includes(booking.status))) {
    throw new Error('Resolve active requests before pausing this listing.');
  }
  return { ...state, items: state.items.map(entry => entry.id === itemId ? { ...entry, available } : entry) };
}

export function rateBooking(state, bookingId, actorId, rating) {
  const booking = state.bookings.find(entry => entry.id === bookingId);
  if (!booking || booking.renterId !== actorId || booking.status !== 'Completed' || booking.rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    throw new Error('This rating is not available.');
  }
  return { ...state, bookings: state.bookings.map(entry => entry.id === bookingId ? { ...entry, rating } : entry) };
}
