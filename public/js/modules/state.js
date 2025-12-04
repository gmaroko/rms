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
  addBooking(booking) {
    this.bookings.push(booking);
    this.saveBookingsToLocal(); // persist after every add
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
      this.saveBookingsToLocal(); // sync local copy
    } catch (err) {
      console.error('Failed to load bookings from API:', err);
      // fallback to local storage if API fails
      this.loadBookingsFromLocal();
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
