import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import roomsRouter from './rooms.js';
import bookingsRouter from './bookings.js';
import { initDB } from './db.js';
import compression from 'compression';
import securityHeaders from './security-headers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security & performance middlewares
app.use(compression()); // gzip/Brotli (if supported by upstream) for responses
app.use(express.json({ limit: '10kb' })); // small body size limit
app.use(securityHeaders);

// API routes
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

// Serve static frontend (unchanged structure)
const publicRoot = path.join(__dirname, '..', '..'); // matches your original setup
app.use(express.static(publicRoot, { index: 'index.html' }));

// Fallback: send index.html for client-side routes
app.get('*', (req, res) => {
  res.sendFile(path.join(publicRoot, 'index.html'));
});

const PORT = process.env.PORT || 3000;
initDB().then(() => {
  app.listen(PORT, () => {
    // Helpful log for evidence
    console.log(`App running at http://localhost:${PORT}`);
  });
});
