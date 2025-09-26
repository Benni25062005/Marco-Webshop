import jwt from "jsonwebtoken";


function getTokenFromReq(req) {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim();


  if (req.headers.cookie) {
    const cookie = req.headers.cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("token="));
    if (cookie) return decodeURIComponent(cookie.slice(6));
  }

  return null;
}

export const authenticateToken = (req, res, next) => {
  const token = getTokenFromReq(req);
  if (!token)
    return res.status(401).json({ message: "Kein Token übermittelt" });

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    { algorithms: ["HS256"] }, 
    (err, payload) => {
      if (err) {
        
        if (err.name === "TokenExpiredError") {
          return res.status(401).json({ message: "Token abgelaufen" });
        }
        return res.status(403).json({ message: "Ungültiger Token" });
      }
      req.user = payload
      next();
    }
  );
};

// Für Admin-Routen
export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Nur für Admins erlaubt" });
  }
  next();
};
