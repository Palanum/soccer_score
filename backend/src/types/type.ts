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
export type Match = {
  id: number;

  datetime: string;
  timestamp: number;

  status: {
    short: string;
    text: string;
    elapsed: number | null;
    live: boolean;
  };

  league: {
    id: number;
    name: string;
    country: string;
    season: number;
    logo?: string;
  };

  teams: {
    home: {
      name: string;
      logo?: string;
      goals: number | null;
    };
    away: {
      name: string;
      logo?: string;
      goals: number | null;
    };
  };

  score: any; // keep raw score for later (HT/FT/ET)
}
