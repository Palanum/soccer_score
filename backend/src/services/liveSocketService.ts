// backend/src/services/socketService.ts

import { Server as HTTPServer } from 'http';
import { Server, Socket } from 'socket.io';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  InterServerEvents,
  SocketData,
} from '../types/socket.types';
import * as footballAPI from '../lib/apiFootball';
import { Match } from '../types/football.types';

type SocketServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

const LIVE_ROOM = 'live_room';

// Production-safe polling interval
const POLL_INTERVAL =
  process.env.NODE_ENV === 'production'
    ? 15000 // 15s in production (paid tier ready)
    : 60000; // 60s in development

class SocketService {
  private io: SocketServer | null = null;
  private liveMatchInterval: NodeJS.Timeout | null = null;
  private lastLiveHash: string = '';

  initialize(httpServer: HTTPServer): SocketServer {
    this.io = new Server(httpServer, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
      pingTimeout: 60000,
      pingInterval: 25000,
    });

    this.setupEventHandlers();
    this.startLiveMatchPolling();

    console.log('✓ Socket server initialized');
    return this.io;
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: TypedSocket) => {
      console.log(`✓ Client connected: ${socket.id}`);

      socket.emit('connected', {
        message: 'Connected to Football Live Score Server',
        connectedClients: this.io!.sockets.sockets.size,
      });

      // Subscribe to live matches
      socket.on('subscribeToLive', async () => {
        socket.join(LIVE_ROOM);
        console.log(`Client ${socket.id} joined live room`);

        // Send immediate snapshot
        await this.sendLiveMatches();
      });

      socket.on('unsubscribeFromLive', () => {
        socket.leave(LIVE_ROOM);
        console.log(`Client ${socket.id} left live room`);
      });

      // Request fixtures by date
      socket.on('requestFixtures', async (date: string) => {
        try {
          const data = await footballAPI.getFixturesByDate(date);

          socket.emit('fixturesUpdate', {
            date,
            matches: data.response,
          });
        } catch (error) {
          socket.emit('error', {
            message: 'Failed to fetch fixtures',
          });
        }
      });

      // Request leagues
      socket.on('requestLeagues', async () => {
        try {
          const data = await footballAPI.getLeagues();
          socket.emit('leaguesUpdate', data.response);
        } catch (error) {
          socket.emit('error', {
            message: 'Failed to fetch leagues',
          });
        }
      });

      socket.on('disconnect', () => {
        console.log(`✗ Client disconnected: ${socket.id}`);
        console.log(
          `Active connections: ${this.io!.sockets.sockets.size}`
        );
      });
    });
  }

  // Start polling live matches
  private startLiveMatchPolling(): void {
    if (this.liveMatchInterval) return;

    this.liveMatchInterval = setInterval(async () => {
      if (!this.io) return;

      const roomSize =
        this.io.sockets.adapter.rooms.get(LIVE_ROOM)?.size || 0;

      if (roomSize === 0) {
        console.log('No clients in live room, skipping API call');
        return;
      }

      await this.sendLiveMatches();
    }, POLL_INTERVAL);

    console.log(
      `✓ Live polling started (${POLL_INTERVAL / 1000}s interval)`
    );
  }

  // Fetch + broadcast live matches (only if changed)
  private async sendLiveMatches(): Promise<void> {
    try {
      const data = await footballAPI.getLiveMatches();
      const matches = data.response;

      const newHash = JSON.stringify(matches);

      if (newHash === this.lastLiveHash) {
        console.log('No live match changes');
        return;
      }

      this.lastLiveHash = newHash;

      if (this.io) {
        this.io.to(LIVE_ROOM).emit('liveMatchesUpdate', matches);
        console.log(
          `✓ Broadcast ${matches.length} live matches`
        );
      }
    } catch (error) {
      console.error('Error fetching live matches:', error);

      if (this.io) {
        this.io.to(LIVE_ROOM).emit('error', {
          message: 'Failed to fetch live matches',
        });
      }
    }
  }

  // Manual broadcast for specific date (admin use)
  public async broadcastFixtures(date: string): Promise<void> {
    if (!this.io) return;

    try {
      const data = await footballAPI.getFixturesByDate(date);

      this.io.emit('fixturesUpdate', {
        date,
        matches: data.response,
      });

      console.log(`✓ Broadcast fixtures for ${date}`);
    } catch (error) {
      console.error('Error broadcasting fixtures:', error);
    }
  }

  public getConnectedClientsCount(): number {
    return this.io ? this.io.sockets.sockets.size : 0;
  }

  public cleanup(): void {
    if (this.liveMatchInterval) {
      clearInterval(this.liveMatchInterval);
      this.liveMatchInterval = null;
    }

    this.lastLiveHash = '';
  }
}

export default new SocketService();