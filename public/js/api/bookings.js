import { Router } from 'express';
import { initDB } from './db.js';
import { sanitizeString, isISODateString, isValidRoomType } from './validate.js';

const router = Router();

// GET all bookings (most recent first)
router.get('/', async (req, res) => {
  try {
    const db = await initDB();
    const bookings = await db.all('SELECT * FROM bookings ORDER BY id DESC');
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching bookings', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST new booking
router.post('/', async (req, res) => {
  try {
    const raw = req.body || {};

    // Sanitize inputs
    const name = sanitizeString(raw.name, 120);
    const date = typeof raw.date === 'string' ? raw.date.trim() : '';
    const roomType = typeof raw.roomType === 'string' ? raw.roomType.trim() : '';

    // Basic presence checks
    if (!name || !date || !roomType) {
      return res.status(400).json({ error: 'Invalid booking data: missing fields' });
    }

    // Format/value validation
    if (!isISODateString(date)) {
      return res.status(400).json({ error: 'Invalid date format (expected YYYY-MM-DD)' });
    }

    if (!isValidRoomType(roomType)) {
      return res.status(400).json({ error: 'Invalid room type' });
    }

    // Persist (prepared statement)
    const db = await initDB();
    const result = await db.run(
      'INSERT INTO bookings (name, date, roomType) VALUES (?, ?, ?)',
      [name, date, roomType]
    );

    res.status(201).json({ id: result.lastID, name, date, roomType });
  } catch (err) {
    console.error('Error posting booking', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
