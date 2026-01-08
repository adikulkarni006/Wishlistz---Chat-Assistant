import jwt from "jsonwebtoken";

export default function authOptionalMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  // No token → guest user
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info if token is valid
    req.user = {
      id: decoded.id
    };

  } catch (err) {
    // Invalid token → treat as guest
    console.warn("Invalid JWT, continuing as guest");
  }

  next();
}
