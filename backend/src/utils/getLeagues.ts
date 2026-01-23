import { apiFootball } from "../lib/apiFootball";
import { League } from "../types/type";
import { mapLeague } from "../utils/mapingType";

export async function getLeagues(): Promise<League[]> {
  const res = await apiFootball.get("/leagues", {
    params: { current: true },
  });

  return res.data.response.map(mapLeague);
}
