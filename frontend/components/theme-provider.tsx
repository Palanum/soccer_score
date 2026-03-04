"use client";

import { createContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

export const ThemeContext = createContext({
  theme: "light" as Theme,
  toggle: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;

    if (stored) {
      setTheme(stored);
      document.documentElement.classList.add(stored);
    }
  }, []);

  const toggle = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);

    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);

    localStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}