
import { state } from './state.js';

export function renderRooms() {
  const container = document.getElementById('room-list');
  const rooms = state.getRooms();

  container.innerHTML = `
    <ul>
      ${rooms.map(room => `<li>${room.name} - ${room.type} (Capacity: ${room.capacity})</li>`).join('')}
    </ul>
  `;
}
