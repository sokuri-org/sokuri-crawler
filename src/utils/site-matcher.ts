export function isMatchSite(url: string, keywords: readonly string[] = []): boolean {
  return keywords.some((keyword) => url.includes(keyword));
}
