export function isMatchSite(url, keywords = []) {
  return keywords.some((keyword) => url.includes(keyword));
}
