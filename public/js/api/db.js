import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function initDB() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  // Ensure tables exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      capacity INTEGER NOT NULL
    );
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      roomType TEXT NOT NULL
    );
  `);

  // Auto‑seed rooms if empty
  const roomCount = await db.get('SELECT COUNT(*) as count FROM rooms');
  if (roomCount.count === 0) {
    const types = ['single', 'double', 'dorm'];
    const names = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'];

    for (let i = 0; i < 3; i++) {
      const type = types[Math.floor(Math.random() * types.length)];
      const capacity = type === 'single' ? 2 : type === 'double' ? 4 : 6;
      const name = `Room ${names[Math.floor(Math.random() * names.length)]}`;
      await db.run(
        'INSERT INTO rooms (name, type, capacity) VALUES (?, ?, ?)',
        [name, type, capacity]
      );
    }
    console.log('Seeded random rooms');
  }

  // Auto‑seed bookings if empty
  const bookingCount = await db.get('SELECT COUNT(*) as count FROM bookings');
  if (bookingCount.count === 0) {
    const people = ['Alice', 'Bob', 'Charlie', 'Diana'];
    const roomTypes = ['single', 'double', 'dorm'];

    for (let i = 0; i < 3; i++) {
      const name = people[Math.floor(Math.random() * people.length)];
      const roomType = roomTypes[Math.floor(Math.random() * roomTypes.length)];
      const date = new Date(Date.now() + i * 86400000)
        .toISOString()
        .split('T')[0];

      await db.run(
        'INSERT INTO bookings (name, date, roomType) VALUES (?, ?, ?)',
        [name, date, roomType]
      );
    }
    console.log('Seeded random bookings');
  }

  return db;
}
