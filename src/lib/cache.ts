type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const memoryCache = new Map<string, CacheEntry<any>>();

const DEFAULT_TTL = 60 * 5; // 5 menit

export function setCache<T>(
  key: string,
  data: T,
  ttl: number = DEFAULT_TTL
) {
  const expiry = Date.now() + ttl * 1000;

  memoryCache.set(key, {
    data,
    expiry,
  });
}

export function getCache<T>(key: string): T | null {
  const entry = memoryCache.get(key);

  if (!entry) return null;

  if (Date.now() > entry.expiry) {
    memoryCache.delete(key);
    return null;
  }

  return entry.data as T;
}

export function clearCache(key?: string) {
  if (key) {
    memoryCache.delete(key);
  } else {
    memoryCache.clear();
  }
}