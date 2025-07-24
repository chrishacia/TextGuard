import 'dotenv/config';
import path from 'path';
import express from 'express';
import cors from 'cors';
import spamRouter from './routes/spam';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/score', spamRouter);

app.get('/api/alive', (_req, res) => res.json({ ok: true }));

const publicDir = path.resolve(__dirname, 'public');
app.use(express.static(publicDir));

app.use((req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(publicDir, 'index.html'));
});

// Maybe keep?
// app.get('/', (_req, res) => {
//   res.send('TextGuard API is up 🚀');
// });

// Global error handler
app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[GLOBAL ERROR]', err);
  res.status(500).json({ error: (err as Error).message ?? 'Internal error' });
});

const SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'http';
const SERVER_DOMAIN   = process.env.SERVER_DOMAIN   || 'localhost';
const SERVER_PORT     = process.env.SERVER_PORT     || '4000';
const PORT_PART       = SERVER_PORT ? `:${SERVER_PORT}` : '';
const BASE_URL        = `${SERVER_PROTOCOL}://${SERVER_DOMAIN}${PORT_PART}`;

app.listen(Number(SERVER_PORT), () => {
  console.log(`🚀 TextGuard API listening on ${BASE_URL}`);
});
