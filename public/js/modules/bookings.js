import { state } from './state.js';
import { validateDate } from './utils.js';

export function renderBookingForm() {
  const container = document.getElementById('booking-form');
  container.innerHTML = `
    <form id="bookingForm">
      <label>Name: <input type="text" name="name" required></label>
      <label>Date: <input type="date" name="date" required></label>
      <label>Room Type:
        <select name="roomType" required>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="dorm">Dorm</option>
        </select>
      </label>
      <button type="submit">Book</button>
    </form>
  `;

  document.getElementById('bookingForm').addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const booking = {
      name: formData.get('name'),
      date: formData.get('date'),
      roomType: formData.get('roomType')
    };

    // Validate date before sending
    if (!validateDate(booking.date)) {
      alert('Invalid date!');
      return;
    }

    // Send booking to backend API
    fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`Booking failed: ${response.status}`);
        }
        return response.json();
      })
      .then(savedBooking => {
        // Update local state with saved booking
        state.addBooking(savedBooking);
        alert('Booking successful!');
      })
      .catch(error => {
        console.error(error);
        alert('Booking failed, please try again.');
      });
  });
}
