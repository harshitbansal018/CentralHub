import { getPostsByUser, getPostCount } from "../models/postModel.js";

export const fetchPosts = async (req, res) => {
  const userId = req.user.userId; // later from auth

  try {
    const posts = await getPostsByUser(userId);
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

// 🔹 Get total count
export const fetchPostCount = async (req, res) => {
  const userId = req.user.userId; // later from auth

  try {
    const count = await getPostCount(userId);
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch count" });
  }
};
