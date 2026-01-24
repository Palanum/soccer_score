import { Fixture, League,Match } from "../types/type";
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

function mapToSchedule(fixtures: any[]) {
  return fixtures.map((f) => ({
    fixtureId: f.fixture.id,

    league: {
      id: f.league.id,
      name: f.league.name,
      logo: f.league.logo,
    },

    datetime: f.fixture.date,
    timestamp: f.fixture.timestamp,

    status: {
      short: f.fixture.status.short,
      text: f.fixture.status.long,
      elapsed: f.fixture.status.elapsed,
    },

    home: {
      name: f.teams.home.name,
      logo: f.teams.home.logo,
      goals: f.goals.home,
    },
    away: {
      name: f.teams.away.name,
      logo: f.teams.away.logo,
      goals: f.goals.away,
    },
  }));
}

function mapToMatch(f: any): Match {
  return {
    id: f.fixture.id,

    datetime: f.fixture.date,
    timestamp: f.fixture.timestamp,

    status: {
      short: f.fixture.status.short,
      text: f.fixture.status.long,
      elapsed: f.fixture.status.elapsed,
      live: isLiveMatch(f.fixture.status.short),
    },

    league: {
      id: f.league.id,
      name: f.league.name,
      country: f.league.country,
      season: f.league.season,
      logo: f.league.logo,
    },

    teams: {
      home: {
        name: f.teams.home.name,
        logo: f.teams.home.logo,
        goals: f.goals.home,
      },
      away: {
        name: f.teams.away.name,
        logo: f.teams.away.logo,
        goals: f.goals.away,
      },
    },

    score: f.score,
  };
}
export {mapFixture, mapLeague,mapToSchedule,mapToMatch }
