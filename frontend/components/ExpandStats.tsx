"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function ExpandStats({ fixtureId }: any) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    axios
      .get(`/api/fixtures?fixture=${fixtureId}`)
      .then((res) => setStats(res.data.response))
      .catch(() => {});
  }, [fixtureId]);

  if (!stats) return <p className="mt-3 text-sm">Loading stats...</p>;

  return (
    <div className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
      <p>Shots on Target: {stats[0]?.statistics?.[0]?.value}</p>
      <p>Possession: {stats[0]?.statistics?.[9]?.value}</p>
    </div>
  );
}