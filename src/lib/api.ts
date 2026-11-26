const rawApiBase = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '');

export const API_BASE_URL = rawApiBase;

export function apiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
}

export function resolveAssetUrl(url?: string): string | undefined {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('/uploads/') && API_BASE_URL) {
    return `${API_BASE_URL}${url}`;
  }
  return url;
}

export function apiFetch(input: string, init?: RequestInit): Promise<Response> {
  return fetch(apiUrl(input), init);
}
