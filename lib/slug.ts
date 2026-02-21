/**
 * URL-safe slug: lowercase, spaces → hyphens, only [a-z0-9-].
 * Use for product URLs and image folder paths so links never break.
 */
export function normalizeSlug(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "product";
}
