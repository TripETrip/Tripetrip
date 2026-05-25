export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stableId(prefix: string, value: string) {
  return `${prefix}_${slugify(value).replace(/-/g, '_')}`;
}
