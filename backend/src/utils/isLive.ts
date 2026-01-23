export function isLiveMatch(status: string): boolean {
  return ['LIVE', '1H', '2H', 'HT', 'ET', 'P'].includes(status);
}
