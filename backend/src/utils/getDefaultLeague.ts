import { apiFootball } from '../lib/apiFootball';

type LeagueResult = {
  league: {
    id: number;
    name: string;
    type: string;
  };
  country: {
    name: string;
    code: string | null;
  };
  seasons: {
    year: number;
    current: boolean;
  }[];
};

export async function getDefaultLeague() {
  const res = await apiFootball.get('/leagues', {
    params: {
      current: true,
    },
  });

  const leagues: LeagueResult[] = res.data.response;

  // 1️⃣ Keep only real leagues (not cups)
  const leagueOnly = leagues.filter(
    l => l.league.type === 'League'
  );

  // 2️⃣ Prefer popular leagues automatically
  const priority = [
    'England',
    'Thailand',
    'Spain',
    'Germany',
    'Italy',
    'France',
  ];

  leagueOnly.sort((a, b) => {
    const pa = priority.indexOf(a.country.name);
    const pb = priority.indexOf(b.country.name);

    return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
  });

  // 3️⃣ Pick FIRST league that has a next match
  for (const league of leagueOnly) {
    const season = league.seasons.find(s => s.current)?.year;
    if (!season) continue;

    const nextRes = await apiFootball.get('/fixtures', {
      params: {
        league: league.league.id,
        season,
        next: 1,
      },
    });

    if (nextRes.data.response.length > 0) {
      return {
        id: league.league.id,
        name: league.league.name,
        country: league.country.name,
        season,
      };
    }
  }

  throw new Error('No active league with upcoming fixtures found');
}
