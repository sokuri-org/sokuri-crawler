import { describe, it, expect } from "vitest";
import { crawlMusinsaReviewImages } from "../../src/crawlers/musinsa.js";

describe("무신사 리뷰 이미지 크롤링 E2E 테스트", () => {
  const WAIT_TIME = 30000;

  it(
    "상품 URL을 받아 후기 이미지를 크롤링하고 서버로 전송한다",
    async () => {
      const testUrl = "https://www.musinsa.com/products/3654291";
      const result = await crawlMusinsaReviewImages(testUrl);

      expect(result.success).toBe(true);
      expect(result.product_id).toEqual("3654291");
      expect(result.imageCount).toBeGreaterThan(0);
    },
    WAIT_TIME
  );
});
