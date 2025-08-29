import fs from "fs/promises";
import path from "path";
import puppeteer, { Browser, Page } from "puppeteer";
import { downloadImages } from "../utils/download-images.js";
import { guessCategoryFromTitle } from "../utils/match-category.js";
import { envConfig } from "../config/env.config.js";
import type { CrawlResult } from "../types/api.types.js";

const OUTPUT_PATH = "data/review-images.json";
const MAX_REVIEW_INDEX = 100;

async function extractTitleFromMusinsa(page: Page, productId: string): Promise<string> {
  const productUrl = `https://www.musinsa.com/products/${productId}`;
  await page.goto(productUrl, { waitUntil: "networkidle2" });

  const title = await page.evaluate(() => {
    const container = document.querySelector("div.sc-1omefes-0");
    if (!container) return null;

    const titleEl = container.querySelector("span.text-title_18px_med");
    return titleEl ? (titleEl as HTMLElement).innerText.trim() : null;
  });

  return title || "상품명 없음";
}

async function resolveRedirectAndExtractProductId(page: Page, inputUrl: string): Promise<string> {
  let finalUrl = inputUrl;

  if (inputUrl.includes("musinsaapp.page.link")) {
    await page.goto(inputUrl, { waitUntil: "networkidle2" });
    finalUrl = page.url();

    console.log("리디렉션 완료", finalUrl);
  }

  const match = finalUrl.match(/products\/(\d+)/);
  if (!match || !match[1]) throw new Error("상품 ID를 추출할 수 없습니다.");

  return match[1];
}

function getReviewPageUrl(productId: string): string {
  return `https://www.musinsa.com/review/goods/${productId}`;
}

async function getLoadedGalleryImages(page: Page): Promise<string[]> {
  return await page.evaluate(() => {
    const urls = new Set<string>();

    document.querySelectorAll("img").forEach((img) => {
      const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
      if (
        src.includes("image.msscdn.net") &&
        (src.includes("gallery_") || src.includes("/estimate/"))
      ) {
        const cleanUrl = src.split("?")[0];
        if (cleanUrl) urls.add(cleanUrl);
      }
    });

    return Array.from(urls);
  });
}

async function scrollReviewsUntilImageLimit(page: Page): Promise<string[]> {
  const urls = new Set<string>();

  for (let i = 0; i < MAX_REVIEW_INDEX; i++) {
    const selector = `[data-index="${i}"]`;
    const exists = await page.$(selector);
    if (!exists) continue;

    await page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (el) el.scrollIntoView({ behavior: "instant", block: "center" });
    }, selector);

    await new Promise((res) => setTimeout(res, envConfig.SCROLL_DELAY_MS));

    const imageUrls = await getLoadedGalleryImages(page);
    imageUrls.forEach((url) => urls.add(url));

    if (urls.size >= envConfig.IMAGE_LIMIT) break;
  }

  return Array.from(urls).slice(0, envConfig.IMAGE_LIMIT);
}

async function saveImageUrlsToJson(filePath: string, urls: string[]): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(urls, null, envConfig.JSON_INDENT));

  console.log(`후기 이미지 URL ${urls.length}개 JSON 저장 완료`);
}

export type MusinsaCrawlResult = CrawlResult;

export async function crawlMusinsaReviewImages(
  productUrl: string,
  outputPath: string = OUTPUT_PATH
): Promise<MusinsaCrawlResult> {
  const browser: Browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();

  try {
    const productId = await resolveRedirectAndExtractProductId(page, productUrl);
    const reviewPageUrl = getReviewPageUrl(productId);

    await page.goto(reviewPageUrl, { waitUntil: "networkidle2" });
    await page.waitForSelector("[data-index='0']", { timeout: 10000 });

    const imageUrls = await scrollReviewsUntilImageLimit(page);

    if (imageUrls.length === 0) {
      throw new Error("🥲 후기 이미지가 존재하지 않습니다");
    }

    const title = await extractTitleFromMusinsa(page, productId);
    const category = guessCategoryFromTitle(title);

    await saveImageUrlsToJson(outputPath, imageUrls);
    await downloadImages(productId, imageUrls);

    console.log(`🖼️ 무신사 후기 이미지 ${imageUrls.length}장 크롤링 완료 (${productId})`);

    return {
      success: true,
      product_id: productId,
      category: category,
      imageCount: imageUrls.length,
      images: imageUrls,
    };
  } catch (err) {
    console.error(`🥲 무신사 크롤링 실패: ${(err as Error).message}`);
    throw err;
  } finally {
    await browser.close();
  }
}
