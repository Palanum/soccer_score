"use client";

import { useEffect, useState, useRef } from "react";
import { socket } from "@/lib/socket";
import LeagueGroup from "./LeagueGroup";

export default function LiveContainer() {
  const [matches, setMatches] = useState<any[]>([]);
  const prevScores = useRef<Record<number, string>>({});

  useEffect(() => {
    socket.emit("subscribeToLive");

    socket.on("liveMatchesUpdate", (data) => {
      setMatches(data);
    });

    return () => {
      socket.emit("unsubscribeFromLive");
      socket.off("liveMatchesUpdate");
    };
  }, []);

  // Group by league
  const grouped = matches.reduce((acc: any, match: any) => {
    const league = match.league.name;
    if (!acc[league]) acc[league] = [];
    acc[league].push(match);
    return acc;
  }, {});

  if (matches.length === 0) {
    return (
      <div className="text-center mt-10 text-zinc-500">
        No live matches right now.
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      {Object.keys(grouped).map((league) => (
        <LeagueGroup
          key={league}
          league={league}
          matches={grouped[league]}
          prevScores={prevScores}
        />
      ))}
    </div>
  );
}