import { Server } from "socket.io";
import { apiFootball } from "../lib/apiFootball";
import { isLiveMatch } from "../utils/isLive";

let lastPayload = "";

export const startLiveSocket = (io: Server) => {
  setInterval(async () => {
    try {
      const { data } = await apiFootball.get("/fixtures", {
        params: { live: "all" }
      });

      const fixtures = data.response.map((f: any) => ({
        id: f.fixture.id,
        timestamp: f.fixture.timestamp,
        status: f.fixture.status.short,
        live: isLiveMatch(f.fixture.status.short),

        league: {
          id: f.league.id,
          name: f.league.name,
          season: f.league.season,
        },

        teams: {
          home: f.teams.home.name,
          away: f.teams.away.name,
        },

        goals: f.goals,
        score: f.score,
      }));

      const payload = JSON.stringify(fixtures);

      // emit only if changed (IMPORTANT)
      if (payload !== lastPayload) {
        lastPayload = payload;
        io.emit("live_fixtures", fixtures);
      }

    } catch (err: any) {
      console.error("Live socket error:", err.message);
    }
  }, 15000); // every 15s (safe for API limits)
};
