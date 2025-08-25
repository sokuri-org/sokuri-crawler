export const SUPPORTED_SITES = {
  MUSINSA: ["musinsa.com", "musinsaapp.page.link"],
  ZIGZAG: ["zigzag.kr", "s.zigzag.kr"],
} as const;

export type SupportedSite = keyof typeof SUPPORTED_SITES;
export type SiteUrl = (typeof SUPPORTED_SITES)[SupportedSite][number];
