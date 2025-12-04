import express from 'express';
import roomsRouter from './rooms.js';
import bookingsRouter from './bookings.js';
import { initDB } from './db.js';

const app = express();
app.use(express.json());

app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

const PORT = process.env.PORT || 3000;

// Initialize DB and seed before starting server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`API running on http://localhost:${PORT}`);
  });
});
