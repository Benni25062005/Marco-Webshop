import jwt from "jsonwebtoken";
import { getUserById } from "../models/authModel.js";

export const getCurrentUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Nicht eingeloggt" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await getUserById(decoded.idUser);
    if (!user) return res.status(404).json({ message: "User nicht gefunden" });
    res.status(200).json({ user });
  } catch (error) {
    console.error("JWT Fehler:", error.message);
    res.status(403).json({ message: "Token ungültig" });
  }
};
