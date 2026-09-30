/** Single-process sliding windows. Nginx must overwrite the trusted IP header. */
export function createRateLimiter() {
  const store = new Map<string, number[]>();
  return (ip: string, now = Date.now()): number => {
    for (const [key, times] of store) if (times.at(-1)! <= now - 3_600_000) store.delete(key);
    const times = (store.get(ip) ?? []).filter(time => time > now - 3_600_000);
    const recent = times.filter(time => time > now - 600_000);
    const reset = Math.max(recent.length >= 3 ? recent[0] + 600_000 : 0, times.length >= 10 ? times[0] + 3_600_000 : 0);
    if (reset > now) return Math.ceil((reset - now) / 1000);
    if (!store.has(ip) && store.size >= 10_000) return 60;
    store.set(ip, [...times, now]);
    return 0;
  };
}
export const rateLimit = createRateLimiter();
