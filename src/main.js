import { config } from "../config.js";
import cors from "cors";
import express from "express";
import { crawlMusinsaReviewImages } from "./crawlers/musinsa.js";
import { crawlZigzagReviewImages } from "./crawlers/zigzag.js";

const app = express();
app.use(cors());
app.use(express.json());

const DEFAULT_PORT_NUMBER = config.PORT;
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
    throw error;
  }
}

const PORT = process.env.PORT || DEFAULT_PORT_NUMBER;
app.listen(PORT, () => {
  console.log(`크롤러 서버 실행 중: http://localhost:${PORT}`);
});
