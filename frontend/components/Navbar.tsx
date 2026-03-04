"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";
import { ThemeContext } from "./theme-provider";
import FixturesContainer from "./FixturesContainer";

export default function Navbar() {
  const pathname = usePathname();
  const { toggle } = useContext(ThemeContext);

  const navItem = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        pathname === href
          ? "bg-green-500 text-white"
          : "text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-800"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-zinc-900/70 border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold text-lg">
          ⚽ LiveScore
          <span className="text-xs text-red-500 animate-pulse">LIVE</span>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-2">
          {navItem("/", "Live")}
          {navItem("/fixtures", "Fixtures")}
          {navItem("/leagues", "Leagues")}
        </nav>

        {/* Dark Mode */}
        <button
          onClick={toggle}
          className="ml-3 px-3 py-1 rounded-full bg-zinc-200 dark:bg-zinc-800 hover:scale-105 transition"
        >
          🌙
        </button>
      </div>
    </header>
  );
}