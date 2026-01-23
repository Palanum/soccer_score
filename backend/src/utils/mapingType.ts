import { Fixture, League } from "../types/type";
import { isLiveMatch } from "./isLive";

function mapFixture(f: any): Fixture {
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
function mapLeague(l: any): League {
  return {
    id: l.league.id,
    name: l.league.name,
    country: l.country.name,
    season: l.seasons.find((s: any) => s.current)?.year,
  };
}
export {mapFixture, mapLeague }
