import { initRouter } from './modules/router.js';
import { state } from './modules/state.js';

document.addEventListener('DOMContentLoaded', async () => {
  // First, load any locally saved bookings (so UI has something immediately)
  state.loadBookingsFromLocal();

  try {
    // Fetch rooms from backend API
    const resRooms = await fetch('/api/rooms');
    if (!resRooms.ok) throw new Error(`Rooms API error: ${resRooms.status}`);
    const rooms = await resRooms.json();
    state.initRooms(rooms);

    // Fetch bookings from backend API
    await state.loadBookings();
  } catch (err) {
    console.error('API fetch failed, using local fallback:', err);
    // Rooms will remain empty if API fails
    // Bookings already loaded from localStorage above
  }

  // Start router after data is ready
  initRouter();
});
