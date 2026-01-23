type TeamScore = {
  home: number | null;
  away: number | null;
};

export type League = {
  id: number;
  name: string;
  country: string;
  season: number;
};

type Teams = {
  home: string;
  away: string;
};

export type Fixture = {
  id: number;
  date: string;
  timestamp: number;
  status: string;
  live: boolean;

  league: League;
  teams: Teams;
  goals: TeamScore;
  score: any;
};
