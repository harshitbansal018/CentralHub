import express from "express";
import upload from "../config/multer.js"; // ✅ ONLY THIS
import protect from "../middleware/authMiddleware.js";
import {
  redirectToLinkedIn,
  handleLinkedInCallback,
  postToLinkedIn,
  postImageToLinkedIn,
  getLinkedInStatus,
} from "../controllers/linkedinController.js";

const router = express.Router();

// OAuth
router.get("/login", redirectToLinkedIn);
router.get("/callback", handleLinkedInCallback);
router.get("/status", protect, getLinkedInStatus);

// Posting
router.post("/post", postToLinkedIn);

// ✅ use correct multer
router.post("/post-image",protect, upload.single("image"), postImageToLinkedIn);

export default router;