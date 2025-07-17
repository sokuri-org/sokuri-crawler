import express from "express";
import cors from "cors";
import { envConfig } from "../config/env.config.js";
import reviewCrawlRouter from "../routes/review-crawl.router.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", reviewCrawlRouter);

const PORT = process.env.PORT || envConfig.PORT;
app.listen(PORT, () => {
  console.log(`✅ [REVIEW-CRAWLER] 서버 실행 중: http://localhost:${PORT}`);
});
