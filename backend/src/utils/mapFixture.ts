import { Fixture } from "../types/fixture";
import { isLiveMatch } from "../utils/isLive";

export function mapFixture(f: any): Fixture {
  return {
    id: f.fixture.id,
    date: f.fixture.date,
    timestamp: f.fixture.timestamp,
    status: f.fixture.status.short,
    live: isLiveMatch(f.fixture.status.short),

    league: {
      id: f.league.id,
      name: f.league.name,
      country: f.league.country,
      season: f.league.season,
    },

    teams: {
      home: f.teams.home.name,
      away: f.teams.away.name,
    },

    goals: f.goals,
    score: f.score, // ✅ required by interface
  };
}
