import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import roomsRouter from './rooms.js';
import bookingsRouter from './bookings.js';
import { initDB } from './db.js';

import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import xss from 'xss';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// security and secure HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'"],
        "default-src": ["'self'"],
        "img-src": ["'self'", "data:"],
        "style-src": ["'self'", "'unsafe-inline'"],
      }
    },
    crossOriginResourcePolicy: { policy: "same-site" }
  })
);

app.use(compression());

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests. Slow down." }
});

app.use("/api", apiLimiter);

// Parse JSON
app.use(express.json());

// Sanitize incoming JSON payloads
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// api routes
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);

// frontend cache
app.use(express.static(path.join(__dirname, '../../'), {
  etag: true,
  maxAge: "7d",
  immutable: true
}));

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../index.html'));
});

const PORT = process.env.PORT || 3000;

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`App running securely at http://localhost:${PORT}`);
  });
});
