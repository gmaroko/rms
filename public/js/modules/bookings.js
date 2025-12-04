import { state } from './state.js';
import { validateDate } from './utils.js';

export function renderBookingForm() {
  const container = document.getElementById('booking-form');
  if (!container) return;

  container.innerHTML = `
    <form id="bookingForm" novalidate>
      <label>Name: <input type="text" name="name" required aria-required="true"></label>
      <label>Date: <input type="date" name="date" required aria-required="true"></label>
      <label>Room Type:
        <select name="roomType" required aria-required="true">
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="dorm">Dorm</option>
        </select>
      </label>
      <button type="submit">Book</button>
      <p id="status" role="status" aria-live="polite" class="visually-hidden"></p>
    </form>
  `;

  const form = document.getElementById('bookingForm');
  const statusEl = document.getElementById('status');

  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const booking = {
      name: formData.get('name')?.trim(),
      date: formData.get('date'),
      roomType: formData.get('roomType')
    };

    // Validate required fields
    if (!booking.name || !booking.date || !booking.roomType) {
      statusEl.textContent = 'Please fill in all required fields.';
      statusEl.classList.remove('visually-hidden');
      return;
    }

    // Validate date
    if (!validateDate(booking.date)) {
      statusEl.textContent = 'Invalid date. Please choose today or a future date.';
      statusEl.classList.remove('visually-hidden');
      return;
    }

    statusEl.textContent = 'Submitting booking...';
    statusEl.classList.remove('visually-hidden');

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
        // Update local state and persist
        state.addBooking(savedBooking);
        statusEl.textContent = 'Booking successful!';
        form.reset();
      })
      .catch(error => {
        console.error(error);
        statusEl.textContent = 'Booking failed, please try again.';
      });
  });
}
