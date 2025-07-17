import fs from "fs/promises";
import path from "path";
import axios from "axios";

export async function downloadImages(productId, imageUrls, outputRoot = "images") {
  if (!Array.isArray(imageUrls) || imageUrls.length === 0) {
    console.warn("이미지 URL 목록이 비어 있습니다.");
    return;
  }

  const imageId = productId ? productId : "unknown";

  const outputDir = path.join(outputRoot, imageId);
  await fs.mkdir(outputDir, { recursive: true });

  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const ext = path.extname(url).split("?")[0] || ".jpg";
    const filePath = path.join(outputDir, `image_${i + 1}${ext}`);

    try {
      const response = await axios.get(url, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, response.data);
      console.log(`[저장 완료] → ${filePath}`);
    } catch (err) {
      console.warn(`[실패] ${url}: ${err.message}`);
    }
  }
}
