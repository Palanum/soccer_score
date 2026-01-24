import { Match } from "../types/type";

export interface LeagueGroup {
  league: Match["league"];
  matches: Match[];
}

export function groupMatchesByLeague(matches: Match[]): LeagueGroup[] {
  const map = new Map<number, LeagueGroup>();

  for (const match of matches) {
    if (!map.has(match.league.id)) {
      map.set(match.league.id, {
        league: match.league,
        matches: [],
      });
    }

    map.get(match.league.id)!.matches.push(match);
  }

  return Array.from(map.values());
}
