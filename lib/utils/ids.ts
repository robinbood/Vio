const ALPHABET = "0123456789abcdef";
const ALPHABET_LEN = ALPHABET.length;
const ID_LEN = 24;

export function newId(): string {
  const bytes = new Uint8Array(ID_LEN);
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < ID_LEN; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  let out = "";
  for (let i = 0; i < ID_LEN; i++) out += ALPHABET[bytes[i] % ALPHABET_LEN];
  return out;
}

export function newShortId(): string {
  return Math.random().toString(36).slice(2, 10);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export function ensureUniqueSlug(base: string, existing: string[]): string {
  const lower = base.toLowerCase();
  if (!existing.includes(lower)) return lower;
  let n = 2;
  while (existing.includes(`${lower}-${n}`)) n++;
  return `${lower}-${n}`;
}

export function initialsFromName(name: string): string {
  if (!name) return "??";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
