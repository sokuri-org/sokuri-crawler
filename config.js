import dotenv from "dotenv";
dotenv.config();

/* eslint-disable no-magic-numbers */
export const config = {
  PORT: Number(process.env.PORT) || 3100,
  SCROLL_DELAY_MS: Number(process.env.SCROLL_DELAY_MS) || 300,
  IMAGE_LIMIT: Number(process.env.IMAGE_LIMIT) || 20,
  JSON_INDENT: Number(process.env.JSON_INDENT) || 2,
  SERVER_API_URL: process.env.SERVER_API_URL || "http://localhost:8000/crawlImages",
};
