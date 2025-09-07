import { crawlMusinsaReviewImages } from "../crawlers/musinsa.crawler.js";
import { crawlZigzagReviewImages } from "../crawlers/zigzag.crawler.js";
import { SUPPORTED_SITES } from "../constants/supported-sites.js";
import { ERROR_UNSUPPORTED_URL } from "../constants/error-messages.js";
import { isMatchSite } from "../utils/site-matcher.js";
import type { CrawlResult } from "../types/api.types.js";

export async function reviewCrawlService(productUrl: string): Promise<CrawlResult> {
  if (typeof productUrl !== "string" || productUrl.length === 0) {
    throw new Error("유효한 상품 URL이 필요합니다.");
  }

  if (isMatchSite(productUrl, SUPPORTED_SITES.MUSINSA)) {
    return await crawlMusinsaReviewImages(productUrl);
  }

  if (isMatchSite(productUrl, SUPPORTED_SITES.ZIGZAG)) {
    return await crawlZigzagReviewImages(productUrl);
  }

  throw new Error(ERROR_UNSUPPORTED_URL);
}
