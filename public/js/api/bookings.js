import { Router } from 'express';
import { initDB } from './db.js';

const router = Router();

// GET all bookings
router.get('/', async (req, res) => {
  const db = await initDB();
  const bookings = await db.all('SELECT * FROM bookings');
  res.json(bookings);
});

// POST new booking
router.post('/', async (req, res) => {
  const { name, date, roomType } = req.body;
  if (!name || !date || !roomType) {
    return res.status(400).json({ error: 'Invalid booking data' });
  }

  const db = await initDB();
  const result = await db.run(
    'INSERT INTO bookings (name, date, roomType) VALUES (?, ?, ?)',
    [name, date, roomType]
  );

  res.status(201).json({ id: result.lastID, name, date, roomType });
});

export default router;
