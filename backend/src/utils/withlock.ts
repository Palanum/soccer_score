// backend/src/utils/withLock.ts
const inFlight = new Map<string, Promise<any>>();

export async function withLock<T>(
  key: string,
  fn: () => Promise<T>
): Promise<T> {
  if (inFlight.has(key)) {
    return inFlight.get(key)!;
  }

  const promise = fn().finally(() => inFlight.delete(key));
  inFlight.set(key, promise);
  return promise;
}
