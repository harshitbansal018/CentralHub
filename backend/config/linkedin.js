import dotenv from "dotenv";
dotenv.config(); // ✅ ensure env loaded here too

export const linkedinConfig = {
  clientId: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
  redirectUri: process.env.LINKEDIN_REDIRECT_URI,
};