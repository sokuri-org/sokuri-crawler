import { Request, Response } from "express";
import { reviewCrawlService } from "../services/review-crawl.service.js";
import {
  HTTP_BAD_REQUEST,
  HTTP_NOT_FOUND,
  HTTP_INTERNAL_SERVER_ERROR,
} from "../constants/http-status.js";
import type { ReviewCrawlRequest, ReviewCrawlResponse, ErrorResponse } from "../types/api.types.js";

export async function handleReviewCrawl(
  req: Request<{}, ReviewCrawlResponse | ErrorResponse, ReviewCrawlRequest>,
  res: Response<ReviewCrawlResponse | ErrorResponse>
): Promise<void> {
  const { url } = req.body;
  if (!url) {
    res.status(HTTP_BAD_REQUEST).json({ error: "URL이 필요합니다." });
    return;
  }

  try {
    const { images, product_id, category } = await reviewCrawlService(url);

    if (!images?.length) {
      res.status(HTTP_NOT_FOUND).json({ error: "후기 이미지를 찾을 수 없습니다." });
      return;
    }
    if (!category) {
      res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: "카테고리 추정에 실패했습니다." });
      return;
    }

    res.json({ images, product_id, category });
  } catch (error) {
    res.status(HTTP_INTERNAL_SERVER_ERROR).json({ error: (error as Error).message });
  }
}
