import axios from "axios";
import { SERVER_API_URL } from "../constants/crawling.js";

export async function sendImagesToServer({ product_id, source, image_urls }) {
  try {
    const response = await axios.post(SERVER_API_URL, {
      product_id,
      source,
      image_urls,
    });
    console.log("서버 응답:", response.data);
  } catch (error) {
    console.error("서버 전송 실패:", error.message);
  }
}
