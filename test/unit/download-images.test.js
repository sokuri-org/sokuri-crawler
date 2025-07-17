import { describe, it, expect, vi } from "vitest";
import axios from "axios";
import { sendImagesToServer } from "../../src/utils/send-images-to-server.js";

vi.mock("axios");

describe("sendImagesToServer 단위 테스트", () => {
  it("POST 요청을 보내고 정상적으로 응답을 받아야 합니다", async () => {
    const mockResult = { status: "success", processed: 20 };

    axios.post.mockResolvedValue(mockResult);

    const payload = {
      product_id: "12345",
      source: "musinsa",
      image_urls: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    };
    const response = await sendImagesToServer(payload);

    expect(response.status).toEqual(mockResult.status);
    expect(response.processed).toEqual(mockResult.processed);
  });
});
