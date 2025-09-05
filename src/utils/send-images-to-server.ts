import axios, { AxiosResponse } from "axios";
import { envConfig } from "../config/env.config.js";

interface SendImagesRequest {
  product_id: string | number;
  source: string;
  image_urls: string[];
}

export async function sendImagesToServer({
  product_id,
  source,
  image_urls,
}: SendImagesRequest): Promise<AxiosResponse> {
  try {
    const response = await axios.post(envConfig.SERVER_API_URL, {
      product_id,
      source,
      image_urls,
    });

    return response;
  } catch (error) {
    console.error("서버 전송 실패:", (error as Error).message);
    throw error;
  }
}
