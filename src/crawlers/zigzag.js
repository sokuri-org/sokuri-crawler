import fs from "fs/promises";
import path from "path";
import puppeteer from "puppeteer";
import { downloadImages } from "../utils/downloadImages.js";
import { guessCategoryFromTitle } from "../utils/guessCategory.js";
import { config } from "../../config.js";

const REVIEW_IMAGE_SELECTOR = "div.css-s01evr.efs1gt61 img";

async function extractTitleFromZigzag(page, productPageUrl) {
  await page.goto(productPageUrl, { waitUntil: "networkidle2" });

  const title = await page.evaluate(() => {
    const titleEl = document.querySelector("h1.BODY_15.REGULAR");
    return titleEl ? titleEl.innerText.trim() : null;
  });

  return title || "상품명 없음";
}

async function resolveRedirectAndExtractProductInfo(page, inputUrl) {
  let finalUrl = inputUrl;

  if (inputUrl.includes("s.zigzag.kr") || inputUrl.includes("zigzag.kr/p/")) {
    await page.goto(inputUrl, { waitUntil: "networkidle2" });
    finalUrl = page.url();
    console.log("리디렉션 완료", finalUrl);

    const deeplinkMatch = finalUrl.match(/deeplink_url=([^&]+)/);

    if (deeplinkMatch && deeplinkMatch[1]) {
      finalUrl = decodeURIComponent(deeplinkMatch[1]);
    }
  }

  const match = finalUrl.match(/products\/(\d+)/);
  if (!match || !match[1]) throw new Error("상품 ID를 추출할 수 없습니다.");

  const productId = match[1];
  const reviewUrl = `https://zigzag.kr/review/list/${productId}`;
  const productPageUrl = `https://zigzag.kr/catalog/products/${productId}`;

  return { productId, reviewUrl, productPageUrl };
}

async function scrollToLoadAllReviews(page) {
  for (let i = 0; i < config.SCROLL_ITERATIONS; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise((res) => setTimeout(res, config.SCROLL_DELAY_MS));
  }
}

async function extractReviewImageUrls(page) {
  return await page.evaluate((selector) => {
    const urls = new Set();
    const images = document.querySelectorAll(selector);

    images.forEach((img) => {
      const src = img.getAttribute("src") || "";

      if (src.includes("zigzag.kr/original/review/")) {
        urls.add(src.split("?")[0]);
      }
    });

    return Array.from(urls);
  }, REVIEW_IMAGE_SELECTOR);
}

async function saveImageUrlsToJson(filePath, urls) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(urls, null, config.JSON_INDENT));

  console.log(`후기 이미지 URL ${urls.length}개 JSON 저장 완료`);
}

export async function crawlZigzagReviewImages(productUrl, outputPath = "data/review-images.json") {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  try {
    const { productId, reviewUrl, productPageUrl } = await resolveRedirectAndExtractProductInfo(
      page,
      productUrl
    );

    await page.goto(reviewUrl, { waitUntil: "networkidle2" });
    await scrollToLoadAllReviews(page);

    const imageUrls = await extractReviewImageUrls(page);
    const limited = imageUrls.slice(0, config.IMAGE_LIMIT);

    if (limited.length === 0) {
      throw new Error("🥲 후기 이미지가 존재하지 않습니다");
    }

    await saveImageUrlsToJson(outputPath, limited);
    await downloadImages(productId, limited);

    console.log(`🖼️ 지그재그 후기 이미지 ${limited.length}장 크롤링 완료 (${productId})`);

    const title = await extractTitleFromZigzag(page, productPageUrl);
    const category = guessCategoryFromTitle(title);

    return {
      success: true,
      product_id: productId,
      category: category,
      imageCount: limited.length,
      images: limited,
    };
  } catch (err) {
    console.error(`🥲 지그재그 크롤링 실패: ${err.message}`);
    throw err;
  } finally {
    await browser.close();
  }
}
