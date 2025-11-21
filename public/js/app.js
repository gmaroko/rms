import { initRouter } from './modules/router.js';
import { state } from './modules/state.js';

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
  // Load initial data -> we'll later use API of from DB
  state.initRooms([
    { id: 1, name: 'Room A', type: 'single', capacity: 2 },
    { id: 2, name: 'Room B', type: 'double', capacity: 4 },
    { id: 3, name: 'Room C', type: 'dorm', capacity: 6 }
  ]);

  initRouter(); // routing
});
