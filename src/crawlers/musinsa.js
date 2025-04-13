import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { downloadImages } from "../utils/downloadImages.js";
import { sendImagesToServer } from "../api/images.js";
import { SCROLL_DELAY_MS, IMAGE_LIMIT, JSON_INDENT } from "../constants/crawling.js";

const OUTPUT_PATH = "data/review-images.json";
const MAX_REVIEW_INDEX = 100;

async function resolveRedirectAndExtractProductId(page, inputUrl) {
  let finalUrl = inputUrl;

  if (inputUrl.includes("musinsaapp.page.link")) {
    await page.goto(inputUrl, { waitUntil: "networkidle2" });
    finalUrl = await page.url();

    console.log("리디렉션 완료", finalUrl);
  }

  const match = finalUrl.match(/products\/(\d+)/);
  if (!match || !match[1]) throw new Error("상품 ID를 추출할 수 없습니다.");

  return match[1];
}

function getReviewPageUrl(productId) {
  return `https://www.musinsa.com/review/goods/${productId}`;
}

async function getLoadedGalleryImages(page) {
  return await page.evaluate(() => {
    const urls = new Set();

    document.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
      if (
        src.includes("image.msscdn.net") &&
        (src.includes("gallery_") || src.includes("/estimate/"))
      ) {
        urls.add(src.split("?")[0]);
      }
    });

    return Array.from(urls);
  });
}

async function scrollReviewsUntilImageLimit(page) {
  const urls = new Set();

  for (let i = 0; i < MAX_REVIEW_INDEX; i++) {
    const selector = `[data-index="${i}"]`;
    const exists = await page.$(selector);
    if (!exists) continue;

    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    }, selector);

    await new Promise((res) => setTimeout(res, SCROLL_DELAY_MS));

    const imageUrls = await getLoadedGalleryImages(page);
    imageUrls.forEach((url) => urls.add(url));

    if (urls.size >= IMAGE_LIMIT) break;
  }

  return Array.from(urls).slice(0, IMAGE_LIMIT);
}

async function saveImageUrlsToJson(filePath, urls) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(urls, null, JSON_INDENT));

  console.log(`후기 이미지 URL ${urls.length}개 JSON 저장 완료`);
}

export async function crawlMusinsaReviewImages(productUrl, outputPath = OUTPUT_PATH) {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    const productId = await resolveRedirectAndExtractProductId(page, productUrl);
    const reviewPageUrl = getReviewPageUrl(productId);

    await page.goto(reviewPageUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector("[data-index='0']", { timeout: 10000 });

    const imageUrls = await scrollReviewsUntilImageLimit(page, IMAGE_LIMIT);

    if (imageUrls.length === 0) {
      throw new Error("🥲 후기 이미지가 존재하지 않습니다");
    }

    await saveImageUrlsToJson(outputPath, imageUrls);
    await downloadImages(productId, imageUrls);

    await sendImagesToServer({
      product_id: productId,
      source: "musinsa",
      image_urls: imageUrls,
    });

    console.log(
      `🖼️ 무신사 후기 이미지 ${imageUrls.length}장 다운로드 및 서버 전송 완료 (${productId})`
    );
  } catch (err) {
    console.error(`🥲 무신사 크롤링 실패: ${err.message}`);
    throw err;
  } finally {
    await browser.close();
  }
}
