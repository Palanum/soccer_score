import { findNextUpcomingFixtures } from "./findNextUpcomingFixtures";
import { Fixture, League } from "../types/type";

// export async function getDefaultLeague(): Promise<League> {
//   const result = await findNextUpcomingFixtures();

//   if (!result.fixtures || result.fixtures.length === 0) {
//     throw new Error("No upcoming fixtures found");
//   }

//   const fixtures: Fixture[] = result.fixtures;

//   // 1️⃣ Group fixtures by league
//   const leagueMap = new Map<number, League>();

//   for (const f of fixtures) {
//     if (!leagueMap.has(f.league.id)) {
//       leagueMap.set(f.league.id, {
//         id: f.league.id,
//         name: f.league.name,
//         country: f.league.country,
//         season: f.league.season,
//       });
//     }
//   }

//   const leagues = Array.from(leagueMap.values());

//   // 2️⃣ Priority countries
//   const priority = [
//     "England",
//     "Thailand",
//     "Spain",
//     "Germany",
//     "Italy",
//     "France",
//   ];

//   leagues.sort((a, b) => {
//     const pa = priority.indexOf(a.country);
//     const pb = priority.indexOf(b.country);

//     return (pa === -1 ? 99 : pa) - (pb === -1 ? 99 : pb);
//   });

//   // 3️⃣ Return best league
//   return leagues[0];
// }
