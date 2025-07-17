import { reviewCrawlService } from "../services/review-crawl.service.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} from "../constants/http-status.js";

export async function handleReviewCrawl(req, res) {
  const { url } = req.body;
  if (!url) return res.status(HTTP_BAD_REQUEST).json({ error: "URL이 필요합니다." });

  try {
    const { images, product_id, category } = await reviewCrawlService(url);

    if (!images?.length)
      return res.status(HTTP_NOT_FOUND).json({ error: "후기 이미지를 찾을 수 없습니다." });
    if (!category)
      return res
        .status(HTTP_INTERNAL_SERVER_ERROR)
        .json({ error: "카테고리 추정에 실패했습니다." });

    res.json({ images, product_id, category });
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: error.message });
  }
}
