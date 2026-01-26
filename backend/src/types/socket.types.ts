// backend/src/types/socket.types.ts

import { Match, League } from './football.types';

export interface ServerToClientEvents {
  liveMatchesUpdate: (matches: Match[]) => void;
  fixturesUpdate: (data: { date: string; matches: Match[] }) => void;
  leaguesUpdate: (leagues: League[]) => void;
  error: (error: { message: string }) => void;
  connected: (data: { message: string; connectedClients: number }) => void;
}

export interface ClientToServerEvents {
  requestLiveMatches: () => void;
  requestFixtures: (date: string) => void;
  requestLeagues: () => void;
  subscribeToLive: () => void;
  unsubscribeFromLive: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
  subscribedToLive: boolean;
}