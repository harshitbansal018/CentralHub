import axios from "axios";
import fs from "fs";
import path from "path";
import { linkedinConfig } from "../config/linkedin.js";
import {
  saveLinkedInAccount,
  getLinkedInAccount,
} from "../models/linkedinModel.js";
import { savePost } from "../models/postModel.js";
import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

// 🔹 Redirect
export const redirectToLinkedIn = (req, res) => {
  const scope = "openid profile email w_member_social";

  const token = req.query.token; // ✅ get token

  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${linkedinConfig.clientId}&redirect_uri=${linkedinConfig.redirectUri}&scope=${encodeURIComponent(scope)}&state=${token}`;

  res.redirect(url);
};

// 🔹 Callback (FIXED WITH EXPIRY)

export const handleLinkedInCallback = async (req, res) => {
  const { code, state } = req.query;

  try {
    // ✅ Decode user from state (token)
    const decoded = jwt.verify(state, JWT_SECRET);
    const userId = decoded.userId;

    const tokenRes = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: linkedinConfig.redirectUri,
        client_id: linkedinConfig.clientId,
        client_secret: linkedinConfig.clientSecret,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );

    const accessToken = tokenRes.data.access_token;
    const expiresIn = tokenRes.data.expires_in;

    const expiresAt = Date.now() + expiresIn * 1000;

    // ✅ Get LinkedIn user
    const userRes = await axios.get("https://api.linkedin.com/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const linkedinId = userRes.data.sub;

    // ✅ Save with correct user
    await saveLinkedInAccount(userId, linkedinId, accessToken, expiresAt);

    res.redirect("http://localhost:5173/create-post?linkedin=connected");
  } catch (error) {
    console.log("FULL ERROR:", error.response?.data || error);
    res.status(500).json({ error: "LinkedIn auth failed" });
  }
};
// 🔹 TEXT POST
export const postToLinkedIn = async (req, res) => {
  const { caption } = req.body;
  const userId = req.user.userId;

  try {
    const account = await getLinkedInAccount(userId);

    if (!account) {
      return res.status(400).json({ error: "LinkedIn not connected" });
    }

    // ✅ Expiry check
    if (Date.now() > account.expires_at) {
      return res.status(401).json({
        error: "LinkedIn token expired",
      });
    }

    const response = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${account.linkedin_id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: caption },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    await savePost(userId, caption, null, "linkedin");

    res.json({ message: "Post successful 🚀", data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Post failed" });
  }
};

// 🔥 IMAGE POST (FINAL FIX)
export const postImageToLinkedIn = async (req, res) => {
  const { caption } = req.body;
  const userId = req.user.userId;

  try {
    const account = await getLinkedInAccount(userId);

    if (!account) {
      return res.status(400).json({ error: "LinkedIn not connected" });
    }

    // ✅ Expiry check
    if (Date.now() > account.expires_at) {
      return res.status(401).json({
        error: "LinkedIn token expired",
      });
    }

    const imageName = req.file.filename;
    const imagePath = path.join("uploads", imageName);

    // 1. Register upload
    const registerRes = await axios.post(
      "https://api.linkedin.com/v2/assets?action=registerUpload",
      {
        registerUploadRequest: {
          recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
          owner: `urn:li:person:${account.linkedin_id}`,
          serviceRelationships: [
            {
              relationshipType: "OWNER",
              identifier: "urn:li:userGeneratedContent",
            },
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    const uploadUrl =
      registerRes.data.value.uploadMechanism[
        "com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"
      ].uploadUrl;

    const asset = registerRes.data.value.asset;

    // 2. Upload image
    const imageBuffer = fs.readFileSync(imagePath);

    await axios.put(uploadUrl, imageBuffer, {
      headers: { "Content-Type": "application/octet-stream" },
    });

    // 3. Create post
    const postRes = await axios.post(
      "https://api.linkedin.com/v2/ugcPosts",
      {
        author: `urn:li:person:${account.linkedin_id}`,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text: caption },
            shareMediaCategory: "IMAGE",
            media: [{ status: "READY", media: asset }],
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
          "Content-Type": "application/json",
        },
      },
    );

    // ✅ Save only filename
    await savePost(userId, caption, imageName, "linkedin");

    res.json({
      message: "Image post successful 🚀",
      data: postRes.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Image post failed" });
  }
};
export const getLinkedInStatus = async (req, res) => {
  const userId = req.user.userId; // later replace with auth

  try {
    const account = await getLinkedInAccount(userId);

    if (!account) {
      return res.json({ connected: false });
    }

    // check expiry
    if (Date.now() > account.expires_at) {
      return res.json({ connected: false });
    }

    return res.json({
      connected: true,
      expires_at: account.expires_at,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to get status" });
  }
};
