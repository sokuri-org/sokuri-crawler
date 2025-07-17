import axios from "axios";
import { config } from "../../config.js";

export async function sendImagesToServer({ product_id, source, image_urls }) {
  try {
    const response = await axios.post(config.SERVER_API_URL, {
      product_id,
      source,
      image_urls,
    });

    return response;
  } catch (error) {
    console.error("서버 전송 실패:", error.message);
    throw error;
  }
}
