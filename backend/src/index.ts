import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorHandler';

import teamsRoute from './routes/teams';
import leaguesRoute from './routes/leagues';

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

/* -------------------- ROUTES -------------------- */

app.get('/health', (_req, res) => {
  res.send('OK');
});

app.use('/api/teams', teamsRoute);
app.use('/api/leagues', leaguesRoute);

/* -------------------- 404 HANDLER -------------------- */
app.use((req, res) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- SERVER -------------------- */

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
