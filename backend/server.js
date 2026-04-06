import dotenv from "dotenv";
dotenv.config();
import express from "express";
import linkedinRoute from "./routes/linkedinRoute.js";
import postRoutes from "./routes/postRoute.js";
import cors from "cors";
import authRoute from "./routes/authRoute.js";

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://zswq1q1w-5173.inc1.devtunnels.ms",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Private-Network", "true");
  next();
});
app.use(express.json());
app.use("/uploads", express.static("uploads"));
// LinkedIn Routes
app.use("/api/linkedin", linkedinRoute);
app.use("/api/posts", postRoutes);
app.use("/api/auth", authRoute);
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});