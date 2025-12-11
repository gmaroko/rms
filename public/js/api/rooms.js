import { Router } from 'express';
import { initDB } from './db.js';
import { sanitizeString, sanitizeInteger } from './validate.js';

const router = Router();

router.get('/', async (req, res) => {
  const db = await initDB();
  const rooms = await db.all('SELECT * FROM rooms ORDER BY id ASC');
  res.json(rooms);
});

router.post('/', async (req, res) => {
  try {
    const raw = req.body || {};
    const name = sanitizeString(raw.name, 120);
    const type = sanitizeString(raw.type, 30);
    const capacity = sanitizeInteger(raw.capacity, 0);

    if (!name || !type || capacity <= 0) {
      return res.status(400).json({ error: 'Invalid room data' });
    }

    const allowedTypes = ['single', 'double', 'dorm'];
    if (!allowedTypes.includes(type)) {
      return res.status(400).json({ error: 'Invalid room type' });
    }

    const db = await initDB();
    const result = await db.run(
      'INSERT INTO rooms (name, type, capacity) VALUES (?, ?, ?)',
      [name, type, capacity]
    );

    res.status(201).json({ id: result.lastID, name, type, capacity });
  } catch (err) {
    console.error('Error creating room', err);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
