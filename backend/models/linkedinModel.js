import { db } from "../config/db.js";

// Save or update LinkedIn account
export const saveLinkedInAccount = async (
  userId,
  linkedinId,
  accessToken,
  expiresAt
) => {
  await db.execute(
    `INSERT INTO linkedin_accounts 
    (user_id, linkedin_id, access_token, expires_at, connected)
     VALUES (?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
     access_token = VALUES(access_token),
     expires_at = VALUES(expires_at),
     connected = 1`,
    [userId, linkedinId, accessToken, expiresAt, 1] // ✅ correct mapping
  );
};

// Get LinkedIn account
export const getLinkedInAccount = async (userId) => {
  const [rows] = await db.execute(
    "SELECT * FROM linkedin_accounts WHERE user_id = ?",
    [userId]
  );
  return rows[0];
};