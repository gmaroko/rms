import { initRouter } from './modules/router.js';
import { state } from './modules/state.js';

document.addEventListener('DOMContentLoaded', () => {
  // Fetch initial data from backend API
  fetch('/api/rooms')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network error: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      state.initRooms(data);   // hydrate state with API data
      initRouter();            // start routing after data is ready
    })
    .catch(error => {
      console.error('Failed to load rooms:', error);
      // Fallback: start router even if API fails
      initRouter();
    });
});
