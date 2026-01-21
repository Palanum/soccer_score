import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

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

/* -------------------- 404 HANDLER -------------------- */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found',
    path: req.originalUrl,
  });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use((
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error('🔥 Error:', err);

  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
  });
});

/* -------------------- SERVER -------------------- */

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
