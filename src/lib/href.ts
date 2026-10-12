/**
 * Prefix an internal path with the configured base path and normalise the
 * trailing slash so GitHub Pages serves `dir/index.html` without a redirect
 * hop. External URLs and anchors pass through untouched.
 */
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');

export function href(path: string): string {
  if (/^(https?:|mailto:|tel:|#)/.test(path)) return path;
  const [pathname, hash] = path.split('#');
  const clean = pathname.replace(/\/+$/, '') || '';
  // Files (anything with an extension) keep their exact path.
  const isFile = /\.[a-z0-9]+$/i.test(clean);
  const out = isFile ? `${base}${clean}` : `${base}${clean}/`;
  return hash ? `${out}#${hash}` : out;
}

/** True when `current` is `path` or one of its children. */
export function isActive(current: string, path: string): boolean {
  const target = href(path);
  if (path === '/') return current === target;
  return current === target || current.startsWith(target);
}

/** Visible marker for content that still has to be supplied. */
export const PLACEHOLDER = '[PLACEHOLDER]';
export function isPlaceholder(value: string | undefined | null): boolean {
  return !value || value.startsWith('[PLACEHOLDER');
}
