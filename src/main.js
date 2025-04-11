import { crawlMusinsaReviewImages } from "./crawlers/musinsa.js";
import { crawlZigzagReviewImages } from "./crawlers/zigzag.js";

const SUPPORTED_SITES = {
  MUSINSA: ["musinsa.com", "musinsaapp.page.link"],
  ZIGZAG: ["zigzag.kr", "s.zigzag.kr"],
};

const ERROR_UNSUPPORTED_URL = "지원하지 않는 URL입니다.";

function isMatchSite(url, keywords = []) {
  return keywords.some((keyword) => url.includes(keyword));
}

export async function crawlReviewImagesByUrl(productUrl) {
  if (typeof productUrl !== "string" || productUrl.length === 0) {
    throw new Error("유효한 상품 URL이 필요합니다.");
  }

  try {
    if (isMatchSite(productUrl, SUPPORTED_SITES.MUSINSA)) {
      return await crawlMusinsaReviewImages(productUrl);
    }

    if (isMatchSite(productUrl, SUPPORTED_SITES.ZIGZAG)) {
      return await crawlZigzagReviewImages(productUrl);
    }

    throw new Error(ERROR_UNSUPPORTED_URL);
  } catch (error) {
    console.error(`크롤링 실패: ${error.message}`);
  }
}
