const getToken = () => localStorage.getItem('cl_token');

export const apiFetch = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

// API Methods
export const api = {
  // Auth
  register: (data) => apiFetch('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => apiFetch('/api/auth/me'),
  
  // Items
  getItems: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiFetch(`/api/items${query ? `?${query}` : ''}`);
  },
  getItem: (id) => apiFetch(`/api/items/${id}`),
  createItem: (data) => apiFetch('/api/items', { method: 'POST', body: JSON.stringify(data) }),
  deleteItem: (id) => apiFetch(`/api/items/${id}`, { method: 'DELETE' }),
  
  // Bookings
  bookItem: (data) => apiFetch('/api/bookings', { method: 'POST', body: JSON.stringify(data) }),
  getMyBookings: () => apiFetch('/api/bookings/mine'),
  payBooking: (id) => apiFetch(`/api/bookings/${id}/pay`, { method: 'POST' }),
  returnBooking: (id) => apiFetch(`/api/bookings/${id}/return`, { method: 'PATCH' }),
  
  // Reviews
  createReview: (data) => apiFetch('/api/reviews', { method: 'POST', body: JSON.stringify(data) }),
  
  // Reset
  resetDb: () => apiFetch('/api/reset', { method: 'POST' })
};
