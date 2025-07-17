import express from "express";
import { handleReviewCrawl } from "../controllers/review-crawl.controller.js";

const router = express.Router();
router.post("/bags/images", handleReviewCrawl);

export default router;
