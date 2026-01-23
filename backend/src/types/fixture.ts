export interface Fixture {
  id: number;
  date: string;
  timestamp: number;
  status: string;
  live: boolean;

  league: {
    id: number;
    name: string;
    country: string;
    season: number;
  };

  teams: {
    home: string;
    away: string;
  };

  goals: {
    home: number | null;
    away: number | null;
  };

  score: any; // or type it later
}
