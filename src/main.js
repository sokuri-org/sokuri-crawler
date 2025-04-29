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

const HTTP_BAD_REQUEST = 400;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERROR = 500;

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

app.post("/bags/sizes", async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(HTTP_BAD_REQUEST).json({ error: "URL이 필요합니다." });

  try {
    const result = await crawlReviewImagesByUrl(url);
    console.log(result);
    const { images, product_id, category } = result;

    if (!images || images.length === 0) {
      return res.status(HTTP_NOT_FOUND).json({ error: "후기 이미지를 찾을 수 없습니다." });
    }

    if (!category) {
      return res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: "카테고리 추정에 실패했습니다." });
    }

    res.json({ images, product_id, category });
  } catch (err) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
});

const PORT = process.env.PORT || DEFAULT_PORT_NUMBER;
app.listen(PORT, () => {
  console.log(`크롤러 서버 실행 중: http://localhost:${PORT}`);
});
