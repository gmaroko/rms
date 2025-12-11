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
const publicRoot = path.join(__dirname, '..', '..');

const app = express();

app.use(compression());

app.use(express.json({ limit: '10kb' }));

app.use(securityHeaders);

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API routes
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

app.use(express.static(publicRoot, { index: 'index.html' }));

app.get('*', (req, res) => {
  res.sendFile(path.join(publicRoot, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (res.headersSent) return next(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server after DB initialized
const PORT = process.env.PORT || 3000;
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`App running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('Failed to initialize DB', err);
    process.exit(1);
  });
