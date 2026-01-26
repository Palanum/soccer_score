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

class SocketService {
  private io: SocketServer | null = null;
  private liveMatchInterval: NodeJS.Timeout | null = null;
  private fixtureIntervals: Map<string, NodeJS.Timeout> = new Map();
  private subscribedClients: Set<string> = new Set();

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
    this.startLiveMatchUpdates();

    return this.io;
  }

  private setupEventHandlers(): void {
    if (!this.io) return;

    this.io.on('connection', (socket: TypedSocket) => {
      console.log(`✓ Client connected: ${socket.id}`);

      // Send welcome message
      socket.emit('connected', {
        message: 'Connected to Football Live Score Server',
        connectedClients: this.io!.sockets.sockets.size,
      });

      // Handle live matches subscription
      socket.on('subscribeToLive', () => {
        this.subscribedClients.add(socket.id);
        console.log(`Client ${socket.id} subscribed to live updates`);
        
        // Send current live matches immediately
        this.sendLiveMatches();
      });

      socket.on('unsubscribeFromLive', () => {
        this.subscribedClients.delete(socket.id);
        console.log(`Client ${socket.id} unsubscribed from live updates`);
      });

      // Handle fixtures request
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

      // Handle leagues request
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

      // Handle disconnection
      socket.on('disconnect', () => {
        this.subscribedClients.delete(socket.id);
        console.log(`✗ Client disconnected: ${socket.id}`);
        console.log(`Active connections: ${this.io!.sockets.sockets.size}`);
      });
    });
  }

  // Fetch and broadcast live matches every 60 seconds
  private startLiveMatchUpdates(): void {
    // Initial fetch
    this.sendLiveMatches();

    // Set up interval for updates
    this.liveMatchInterval = setInterval(() => {
      if (this.subscribedClients.size > 0) {
        this.sendLiveMatches();
      } else {
        console.log('No clients subscribed, skipping live match update');
      }
    }, 600); // 60 seconds

    console.log('✓ Live match updates started (60s interval)');
  }

  private async sendLiveMatches(): Promise<void> {
    try {
      const data = await footballAPI.getLiveMatches();
      const matches = data.response;

      if (this.io && this.subscribedClients.size > 0) {
        this.io.emit('liveMatchesUpdate', matches);
        console.log(
          `✓ Broadcast ${matches.length} live matches to ${this.subscribedClients.size} clients`
        );
      }
    } catch (error) {
      console.error('Error fetching live matches:', error);
      if (this.io) {
        this.io.emit('error', {
          message: 'Failed to fetch live matches',
        });
      }
    }
  }

  // Broadcast fixtures update for a specific date
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

  // Get connected clients count
  public getConnectedClientsCount(): number {
    return this.io ? this.io.sockets.sockets.size : 0;
  }

  // Cleanup
  public cleanup(): void {
    if (this.liveMatchInterval) {
      clearInterval(this.liveMatchInterval);
    }
    this.fixtureIntervals.forEach((interval) => clearInterval(interval));
    this.fixtureIntervals.clear();
    this.subscribedClients.clear();
  }
}

export default new SocketService();