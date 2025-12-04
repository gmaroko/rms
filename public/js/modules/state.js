// Utility functions for IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('RMS_DB', 1);

    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('bookings')) {
        db.createObjectStore('bookings', { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e.target.error);
  });
}

async function saveBookingToIndexedDB(booking) {
  const db = await openDB();
  const tx = db.transaction('bookings', 'readwrite');
  tx.objectStore('bookings').add(booking);
  return tx.complete;
}

async function loadBookingsFromIndexedDB() {
  const db = await openDB();
  return new Promise(resolve => {
    const tx = db.transaction('bookings', 'readonly');
    const store = tx.objectStore('bookings');
    const request = store.getAll();
    request.onsuccess = () => resolve(request.result || []);
  });
}

class State {
  constructor() {
    this.rooms = [];
    this.bookings = [];
  }

  // Rooms
  initRooms(rooms) {
    this.rooms = rooms;
  }

  getRooms() {
    return this.rooms;
  }

  // Bookings
  async addBooking(booking) {
    this.bookings.push(booking);
    this.saveBookingsToLocal();
    await saveBookingToIndexedDB(booking);
  }

  getBookings() {
    return this.bookings;
  }

  // Load bookings from backend API
  async loadBookings() {
    try {
      const res = await fetch('/api/bookings');
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      this.bookings = data;
      this.saveBookingsToLocal();
      // Sync all bookings into IndexedDB
      for (const b of data) {
        await saveBookingToIndexedDB(b);
      }
    } catch (err) {
      console.error('Failed to load bookings from API:', err);
      // fallback to IndexedDB if API fails
      this.bookings = await loadBookingsFromIndexedDB();
      if (!this.bookings || this.bookings.length === 0) {
        this.loadBookingsFromLocal();
      }
    }
  }

  // LocalStorage persistence
  saveBookingsToLocal() {
    try {
      localStorage.setItem('bookings', JSON.stringify(this.bookings));
    } catch (err) {
      console.error('Failed to save bookings locally:', err);
    }
  }

  loadBookingsFromLocal() {
    try {
      const raw = localStorage.getItem('bookings');
      if (raw) {
        this.bookings = JSON.parse(raw);
      }
    } catch (err) {
      console.error('Failed to load bookings locally:', err);
      this.bookings = [];
    }
  }
}

export const state = new State();