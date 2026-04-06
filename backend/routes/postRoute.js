import express from "express";
import protect from "../middleware/authMiddleware.js";
import {
  fetchPosts,
  fetchPostCount,
} from "../controllers/postController.js";

const router = express.Router();

router.get("/all",protect, fetchPosts);
router.get("/count", protect, fetchPostCount);

export default router;