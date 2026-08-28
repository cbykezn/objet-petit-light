const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function sitePath(path = '/') {
  if (/^(?:https?:|mailto:|tel:|#)/.test(path)) return path;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}` || '/';
}

export function assetPath(path: string) {
  return sitePath(path);
}
