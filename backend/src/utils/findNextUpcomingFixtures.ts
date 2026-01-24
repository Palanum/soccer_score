import { apiFootball } from "../lib/apiFootball";
import { mapToMatch } from "./mapingType";
import { groupMatchesByLeague } from "./groupByLeague";
import { saveJson } from "./saveJson";
import { Match } from "../types/type";
import dayjs from "../lib/setupDayjs";

export async function findNextUpcomingFixtures() {
  const from = dayjs()
  const to = dayjs().add(2, "day")
  const adjyearsfrom = from.add(-1, "year").format("YYYY-MM-DD");
  const adjyearsto = to.add(-1, "year").format("YYYY-MM-DD");
  // const res2 = await apiFootball.get("/timezone");
  // const timezones: string[] = res2.data.response;
  // const hasBangkok = timezones.includes("Asia/Bangkok");
  // console.log("Has Asia/Bangkok:", hasBangkok);

  const res1 = await apiFootball.get("/fixtures", {
    params: {
league: '39',
season: '2024',
from: adjyearsfrom,
to: adjyearsto,
timezone: "Asia/Bangkok",
}
  });

  let raw = res1.data.response;
  if (raw.length === 0) {
      throw new Error("No upcoming fixtures found");
  }

  // 🔐 guard ป้องกัน undefined
  if (!Array.isArray(raw)) {
    throw new Error("API-Football response is not an array");
  }

  const matches: Match[] = raw.map(mapToMatch);

  const todayMatches = matches.filter(m =>
    dayjs.unix(m.timestamp)
      .tz("Asia/Bangkok")
      .isSame(dayjs().tz("Asia/Bangkok"), "day")
  );

  const selected = todayMatches.length ? todayMatches : matches;
  const grouped = groupMatchesByLeague(selected);

  return {
    type: todayMatches.length ? "today" : "upcoming",
    count: selected.length,
    matches: selected,
    grouped,
  };
}


