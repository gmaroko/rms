
/**
 * We'll go with hash based routing
 */
export function initRouter() {
  window.addEventListener('hashchange', renderView);
  renderView(); // Initial render
}

function renderView() {
  const route = window.location.hash.replace('#/', '') || 'home';
  const main = document.getElementById('main');

  switch (route) {
    case 'rooms':
      main.innerHTML = `<h1>Available Rooms</h1><div id="room-list"></div>`;
      import('./rooms.js').then(module => module.renderRooms());
      break;
    case 'book':
      main.innerHTML = `<h1>Book a Room</h1><div id="booking-form"></div>`;
      import('./bookings.js').then(module => module.renderBookingForm());
      break;
    default:
      main.innerHTML = `<h1>Welcome to Campus Life</h1>`;
  }
}
