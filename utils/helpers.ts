export function buildUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function randomEmail(prefix = 'testuser'): string {
  const randomPart = Math.random().toString(36).slice(2, 10);
  return `${prefix}${randomPart}@example.com`;
}

export async function toJsonSafe<T>(value: {
  json: () => Promise<unknown>;
}): Promise<T | null> {
  try {
    return (await value.json()) as T;
  } catch {
    return null;
  }
}
