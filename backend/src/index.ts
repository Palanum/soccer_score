import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { errorHandler } from './middlewares/errorHandler';
import routes from './routes';

import http from "http";
import { Server } from "socket.io";
import { startLiveSocket } from "./services/liveSocketService";




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

app.use('/api', routes);

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

startLiveSocket(io);


app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
