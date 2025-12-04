import { Router } from 'express';
import { initDB } from './db.js';

const router = Router();

// GET all rooms
router.get('/', async (req, res) => {
  const db = await initDB();
  const rooms = await db.all('SELECT * FROM rooms');
  res.json(rooms);
});

// POST new room
router.post('/', async (req, res) => {
  const { name, type, capacity } = req.body;
  if (!name || !type || !capacity) {
    return res.status(400).json({ error: 'Invalid room data' });
  }

  const db = await initDB();
  const result = await db.run(
    'INSERT INTO rooms (name, type, capacity) VALUES (?, ?, ?)',
    [name, type, capacity]
  );

  res.status(201).json({ id: result.lastID, name, type, capacity });
});

export default router;
