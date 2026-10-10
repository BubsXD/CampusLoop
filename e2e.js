

(async () => {
  try {
    // 1. Register
    await fetch('http://localhost:4000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'E2E Test 2', email: 'e2e2@campusloop.test', password: '123', college: 'Test', roll_no: '2', phone: '2' })
    });

    // 2. Login
    let res = await fetch('http://localhost:4000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'e2e2@campusloop.test', password: '123' })
    });
    let data = await res.json();
    console.log('Login:', data);
    const token = data.token;
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'e2e@campusloop.test', password: '123' })
    });
    data = await res.json();
    console.log('Login:', data);

    // 3. Search items
    res = await fetch('http://localhost:4000/api/items?q=Camera');
    const items = await res.json();
    console.log('Search Items:', items.length);
    const item = items[0];

    // 4. Book it
    const today = new Date().toISOString().split('T')[0];
    const later = new Date();
    later.setDate(later.getDate() + 3);
    const endStr = later.toISOString().split('T')[0];
    
    res = await fetch('http://localhost:4000/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ itemId: item.id, startDate: today, endDate: endStr, agreementAccepted: true })
    });
    let booking = await res.json();
    console.log('Booking:', booking);

    // 5. Pay
    res = await fetch(`http://localhost:4000/api/bookings/${booking.id}/pay`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Pay:', await res.json());

    // 6. Return
    res = await fetch(`http://localhost:4000/api/bookings/${booking.id}/return`, {
      method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Return:', await res.json());

    // 7. Review
    res = await fetch('http://localhost:4000/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ bookingId: booking.id, rating: 5, comment: 'Great test' })
    });
    console.log('Review:', await res.json());

  } catch(e) {
    console.error(e);
  }
})();
