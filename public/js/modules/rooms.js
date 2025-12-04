import { state } from './state.js';

export function renderRooms() {
  const container = document.getElementById('room-list');
  if (!container) return;

  // Show loading state first
  container.innerHTML = `<p>Loading rooms...</p>`;

  try {
    const rooms = state.getRooms();

    if (!rooms || rooms.length === 0) {
      container.innerHTML = `
        <div role="status" aria-live="polite">
          <p>No rooms available yet. Try refreshing or add rooms via the API.</p>
        </div>
      `;
      return;
    }

    // Render room list
    container.innerHTML = `
      <ul>
        ${rooms.map(room => `
          <li>
            <strong>${room.name}</strong> — ${room.type}
            <span>(Capacity: ${room.capacity})</span>
          </li>
        `).join('')}
      </ul>
    `;
  } catch (err) {
    console.error('Error rendering rooms:', err);
    container.innerHTML = `
      <div role="alert">
        <p>Something went wrong while loading rooms. Please try again later.</p>
      </div>
    `;
  }
}
