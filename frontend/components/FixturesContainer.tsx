"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";

export default function FixturesContainer() {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    axios
      .get(`/api/fixtures?date=${date}`)
      .then((res) => setMatches(res.data.response));
  }, [date]);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="mb-4 px-3 py-2 rounded-lg border dark:bg-zinc-800"
      />

      <div className="space-y-3">
        {matches.map((m: any) => (
          <MatchCard
            key={m.fixture.id}
            match={m}
            prevScores={{ current: {} }}
          />
        ))}
      </div>
    </div>
  );
}