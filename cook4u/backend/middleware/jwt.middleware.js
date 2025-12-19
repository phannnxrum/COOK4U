import jwt from "jsonwebtoken";

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1]; // "Bearer <token>"
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this');
    // console.log("Decoded JWT payload:", decoded); // Log payload for debugging
    req.userId = decoded.id;   // lấy id từ payload
    req.email = decoded.email; // lấy email từ payload nếu cần
    // console.log("Authenticated user ID:", req.userId); // Log userId for debugging
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
}

export default authMiddleware;