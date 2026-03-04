"use client";
import { useState, useEffect } from "react";
import clsx from "clsx";
import ExpandStats from "./ExpandStats";

export default function MatchCard({ match, prevScores }: any) {
  const [expanded, setExpanded] = useState(false);
  const [goalFlash, setGoalFlash] = useState(false);

  const home = match.teams.home.name;
  const away = match.teams.away.name;
  const homeLogo = match.teams.home.logo;
  const awayLogo = match.teams.away.logo;
  const goalsHome = match.goals.home ?? 0;
  const goalsAway = match.goals.away ?? 0;

  const scoreKey = match.fixture.id;
  const currentScore = `${goalsHome}-${goalsAway}`;
  const previous = prevScores.current[scoreKey];

  useEffect(() => {
    if (previous && previous !== currentScore) {
      setGoalFlash(true);
      setTimeout(() => setGoalFlash(false), 3000);
    }
    prevScores.current[scoreKey] = currentScore;
  }, [currentScore]);

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow p-4 transition-all">
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <img src={homeLogo} className="w-5 h-5" />
          <span>{home}</span>
        </div>

        <div className="relative">
          <span
            className={clsx(
              "text-lg font-bold transition",
              goalFlash && "text-green-600 scale-110"
            )}
          >
            {goalsHome} - {goalsAway}
          </span>

          {goalFlash && (
            <span className="absolute -top-6 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
              GOAL!
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span>{away}</span>
          <img src={awayLogo} className="w-5 h-5" />
        </div>
      </div>

      {expanded && <ExpandStats fixtureId={match.fixture.id} />}
    </div>
  );
}