import express, { Router } from "express";
import { handleReviewCrawl } from "../controllers/review-crawl.controller.js";

const router: Router = express.Router();
router.post("/bags/images", handleReviewCrawl);

export default router;
