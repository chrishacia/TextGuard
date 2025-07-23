import path from 'path';
import express from 'express';
import cors from 'cors';
import spamRouter from './routes/spam';
import dotenv from 'dotenv';

dotenv.config({
  path: path.join(__dirname, "../../.env")
});

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/score', spamRouter);

app.get('/', (_req, res) => {
  res.send('TextGuard API is up 🚀');
});

app.get('/api/alive', (_req, res) => res.json({ ok: true }));

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[GLOBAL ERROR]', err);
  res.status(500).json({ error: (err as Error).message ?? 'Internal error' });
});


const SERVER_PROTOCOL = process.env.SERVER_PROTOCOL || 'http';
const SERVER_DOMAIN = process.env.SERVER_DOMAIN || 'localhost';
const SERVER_PORT = process.env.SERVER_PORT || null;
const PORT = !SERVER_PORT ? '' : `:${SERVER_PORT}`;

const BASE_URL = `${SERVER_PROTOCOL}://${SERVER_DOMAIN}${PORT}`
app.listen(SERVER_PORT, () => {
  console.log(`🚀 TextGuard API listening on ${BASE_URL}`);
});
