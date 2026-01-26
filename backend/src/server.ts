import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

import http from "http";
import { Server } from "socket.io";


dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

/* -------------------- MIDDLEWARE -------------------- */

app.use(cors({
  origin: 'http://localhost:3000',
}));

app.use(express.json());

/* -------------------- ROUTES -------------------- */

app.get('/health', (_req, res) => {
  res.send('OK');
});

app.use('/api', routes);

/* -------------------- 404 HANDLER -------------------- */
app.use((req: Request, res: Response) => {
  res.status(404).json({
    message: 'Route not found'
  });
});

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- SERVER -------------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("🟢 socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 socket disconnected:", socket.id);
  });
});

// startLiveSocket(io);


app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/`);
});