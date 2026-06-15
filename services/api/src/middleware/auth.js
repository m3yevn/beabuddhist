import jwt from "jsonwebtoken";

const secret = () => process.env.JWT_SECRET || "dev-secret";

export function signToken(userId, email) {
  return jwt.sign({ sub: userId, email }, secret(), { expiresIn: "30d" });
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Bearer token required." });
  }
  try {
    req.user = jwt.verify(token, secret());
    next();
  } catch {
    return res.status(401).json({ error: "UNAUTHORIZED", message: "Invalid or expired token." });
  }
}
