import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
  let token;

  // Token aus Authorization-Header holen
  const authHeader = req.headers["authorization"];
  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  // Oder aus Cookies holen
  if (!token && req.headers.cookie) {
    const cookies = req.headers.cookie.split(";").map((c) => c.trim());
    for (const c of cookies) {
      if (c.startsWith("token=")) {
        token = decodeURIComponent(c.slice("token=".length));
        break;
      }
    }
  }

  // Kein Token gefunden
  if (!token) {
    return res.status(401).json({ message: "Kein Token übermittelt" });
  }

  // Token validieren
  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(403).json({ message: "Ungültiger Token" });
    }
    req.user = payload;
    next();
  });
};
