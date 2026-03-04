"use client";
import { useEffect, useState } from "react";

export default function DarkToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <button
      onClick={() => setDark(!dark)}
      className="text-sm px-3 py-1 rounded-lg bg-zinc-200 dark:bg-zinc-700"
    >
      {dark ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}