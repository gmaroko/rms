
class State {
  constructor() {
    this.rooms = [];
    this.bookings = [];
  }

  initRooms(rooms) {
    this.rooms = rooms;
  }

  getRooms() {
    return this.rooms;
  }

  addBooking(booking) {
    this.bookings.push(booking);
  }

  getBookings() {
    return this.bookings;
  }
}

export const state = new State();
