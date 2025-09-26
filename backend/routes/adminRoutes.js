import express from "express";
import db from "../config/db.js";
const router = express.Router();

router.get("/users", async (req, res) => {
  const [rows] = await db.query(
    "SELECT idUser, email, vorname, nachname, role, createdAt FROM user ORDER BY createdAt DESC LIMIT 20"
  );
  res.json({ data: rows, page: 1, limit: 20, total: rows.length });
});

router.get("/products", async (req, res) => {
  const [rows] = await db.query(
    "SELECT idProdukt, Name, Kategorie, Preis_netto, Preis_brutto FROM produkte ORDER BY Preis_netto DESC LIMIT 20"
  );
  res.json({ data: rows, page: 1, limit: 20, total: rows.length });
});

export default router;
