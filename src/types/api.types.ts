export interface ReviewCrawlRequest {
  url: string;
}

export interface ReviewCrawlResponse {
  readonly images: readonly string[];
  readonly product_id: string;
  readonly category: string;
}

export interface ErrorResponse {
  error: string;
}

export interface CrawlResult {
  success: boolean;
  product_id: string;
  category: string;
  imageCount: number;
  images: string[];
}

export interface ProductInfo {
  productId: string;
  reviewUrl: string;
  productPageUrl: string;
}
