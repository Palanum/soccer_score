import { apiFootball } from "../lib/apiFootball";
import { Fixture } from "../types/fixture";
import { mapFixture } from "./mapFixture";

export async function findNextUpcomingFixtures() {
  const today = new Date().toISOString().slice(0, 10);

  const { data } = await apiFootball.get("/fixtures", {
    params: { next: 20 }
  });

  const fixtures: Fixture[] = data.response.map(mapFixture);

  const todayFixtures = fixtures.filter(f =>
    f.date.startsWith(today)
  );

  if (todayFixtures.length > 0) {
    return {
      type: "today",
      count: todayFixtures.length,
      fixtures: todayFixtures,
    };
  }

  return {
    type: "upcoming",
    count: fixtures.length,
    fixtures,
  };
}

