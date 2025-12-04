import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import roomsRouter from './rooms.js';
import bookingsRouter from './bookings.js';
import { initDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

// API routes
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

// Serve static frontend (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, '../../')));

// Fallback: send index.html for SPA routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
  });
});
