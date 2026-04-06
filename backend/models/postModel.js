import { db } from "../config/db.js";

// Save post
export const savePost = async (userId, caption, imageUrl, platform) => {
  await db.execute(
    `INSERT INTO posts (user_id, caption, image_url, platform)
     VALUES (?, ?, ?, ?)`,
    [userId, caption, imageUrl, platform]
  );
};

// Get all posts of user
export const getPostsByUser = async (userId) => {
  const [rows] = await db.execute(
    "SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC",
    [userId]
  );
  return rows;
};

// Count posts
export const getPostCount = async (userId) => {
  const [rows] = await db.execute(
    "SELECT COUNT(*) as count FROM posts WHERE user_id = ?",
    [userId]
  );
  return rows[0].count;
};