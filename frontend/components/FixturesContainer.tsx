"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import MatchCard from "./MatchCard";

export default function FixturesContainer() {
  const today = new Date().toISOString().split("T")[0];

  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [leagues, setLeagues] = useState<any[]>([]);
  const [league, setLeague] = useState("");
  const [matches, setMatches] = useState([]);

  // 🔹 Load leagues once
  useEffect(() => {
    axios
      .get("/api/leagues")
      .then((res) => setLeagues(res.data.response))
      .catch(console.error);
  }, []);

  // 🔹 Fetch fixtures
  useEffect(() => {
    const params = new URLSearchParams();

    if (from && to) {
      params.append("from", from);
      params.append("to", to);
    }

    if (league) {
      params.append("league", league);
      params.append("season", "2023"); // adjust if needed
    }

    axios
      .get(`/api/fixtures?${params.toString()}`)
      .then((res) => setMatches(res.data.response))
      .catch(console.error);
  }, [from, to, league]);

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-4">

      {/* Date Filter */}
      <div className="flex gap-3">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="px-3 py-2 rounded-lg border"
        />

        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="px-3 py-2 rounded-lg border"
        />
      </div>

      {/* League Dropdown */}
      <select
        value={league}
        onChange={(e) => setLeague(e.target.value)}
        className="px-3 py-2 rounded-lg border w-full"
      >
        <option value="">All Leagues</option>

        {leagues.map((l: any) => (
          <option key={l.league.id} value={l.league.id}>
            {l.league.name} ({l.country.name})
          </option>
        ))}
      </select>

      {/* Matches */}
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