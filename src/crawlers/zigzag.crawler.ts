import fs from "fs/promises";
import path from "path";
import puppeteer, { Browser, Page } from "puppeteer";
import { downloadImages } from "../utils/download-images.js";
import { guessCategoryFromTitle } from "../utils/match-category.js";
import { envConfig } from "../config/env.config.js";
import type { CrawlResult, ProductInfo } from "../types/api.types.js";

const REVIEW_IMAGE_SELECTOR = "div.css-s01evr.efs1gt61 img";

async function extractTitleFromZigzag(page: Page, productPageUrl: string): Promise<string> {
  await page.goto(productPageUrl, { waitUntil: "networkidle2" });

  const title = await page.evaluate(() => {
    const titleEl = document.querySelector("h1.BODY_15.REGULAR");
    return titleEl ? (titleEl as HTMLElement).innerText.trim() : null;
  });

  return title || "상품명 없음";
}

async function resolveRedirectAndExtractProductInfo(
  page: Page,
  inputUrl: string
): Promise<ProductInfo> {
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

async function scrollToLoadAllReviews(page: Page): Promise<void> {
  const SCROLL_ITERATIONS = 10; // envConfig에 SCROLL_ITERATIONS가 없으므로 상수로 정의
  for (let i = 0; i < SCROLL_ITERATIONS; i++) {
    await page.evaluate(() => window.scrollBy(0, window.innerHeight));
    await new Promise((res) => setTimeout(res, envConfig.SCROLL_DELAY_MS));
  }
}

async function extractReviewImageUrls(page: Page): Promise<string[]> {
  return await page.evaluate((selector: string) => {
    const urls = new Set<string>();
    const images = document.querySelectorAll(selector);

    images.forEach((img) => {
      const src = img.getAttribute("src") || "";

      if (src.includes("zigzag.kr/original/review/")) {
        const cleanUrl = src.split("?")[0];
        if (cleanUrl) urls.add(cleanUrl);
      }
    });

    return Array.from(urls);
  }, REVIEW_IMAGE_SELECTOR);
}

async function saveImageUrlsToJson(filePath: string, urls: string[]): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(urls, null, envConfig.JSON_INDENT));

  console.log(`후기 이미지 URL ${urls.length}개 JSON 저장 완료`);
}

export type ZigzagCrawlResult = CrawlResult;

export async function crawlZigzagReviewImages(
  productUrl: string,
  outputPath = "data/review-images.json"
): Promise<ZigzagCrawlResult> {
  const browser: Browser = await puppeteer.launch({ headless: true });
  const page: Page = await browser.newPage();

  try {
    const { productId, reviewUrl, productPageUrl } = await resolveRedirectAndExtractProductInfo(
      page,
      productUrl
    );

    await page.goto(reviewUrl, { waitUntil: "networkidle2" });
    await scrollToLoadAllReviews(page);

    const imageUrls = await extractReviewImageUrls(page);
    const limited = imageUrls.slice(0, envConfig.IMAGE_LIMIT);

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
    console.error(`🥲 지그재그 크롤링 실패: ${(err as Error).message}`);
    throw err;
  } finally {
    await browser.close();
  }
}
