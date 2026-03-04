export function getSeason(): number {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  // Football season logic (July = new season)
  const baseSeason = month < 7 ? year - 1 : year;

  if (process.env.NODE_ENV === "production") {
    return baseSeason;
  }

  // Free tier → use older season
  return baseSeason - 1;
}