import MatchCard from "./MatchCard";

export default function LeagueGroup({
  league,
  matches,
  prevScores,
}: any) {
  if (!matches || matches.length === 0) {
    return <div>Not Founded</div>;
  }
  const logo = matches[0]?.league?.logo;

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <img src={logo} className="w-6 h-6" />
        <h2 className="text-lg font-semibold">{league}</h2>
      </div>

      <div className="space-y-3">
        {matches.map((match: any) => (
          <MatchCard
            key={match.fixture.id}
            match={match}
            prevScores={prevScores}
          />
        ))}
      </div>
    </div>
  );
}