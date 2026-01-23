import { apiFootball } from '../lib/apiFootball';

export async function isLeagueActive(leagueId: number): Promise<boolean> {
  const response = await apiFootball.get('/fixtures', {
    params: {
      league: leagueId,
      next: 1, // check next match
    },
  });

  return response.data.response.length > 0;
}
