import jwt from "jsonwebtoken";

const JWT_SECRET = "your_secret_key";

const protect = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Not authorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ attach user to request
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export default protect;