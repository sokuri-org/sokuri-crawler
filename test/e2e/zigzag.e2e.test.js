import { describe, it, expect } from "vitest";
import { crawlZigzagReviewImages } from "../../src/crawlers/zigzag.js";

describe("지그재그 리뷰 이미지 크롤링 E2E 테스트", () => {
  const WAIT_TIME = 30000;

  it(
    "상품 URL을 받아 후기 이미지를 크롤링하고 서버로 전송한다",
    async () => {
      const testUrl = "https://zigzag.kr/catalog/products/103330594";
      const result = await crawlZigzagReviewImages(testUrl);

      expect(result.success).toBe(true);
      expect(result.product_id).toEqual("103330594");
      expect(result.imageCount).toBeGreaterThan(0);
    },
    WAIT_TIME
  );
});
