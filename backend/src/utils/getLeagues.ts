import { apiFootball } from '../lib/apiFootball';

export interface LeagueInfo {
  id: number;
  name: string;
  country: string;
  season: number;
}

export async function getLeagues(): Promise<LeagueInfo[]> {
  const res = await apiFootball.get('/leagues', {
    params: {
      current: true,
    },
  });

  return res.data.response.map((l: any) => ({
    id: l.league.id,
    name: l.league.name,
    country: l.country.name,
    season: l.seasons.find((s: any) => s.current)?.year,
  }));
}
