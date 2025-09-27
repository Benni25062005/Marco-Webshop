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

router.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM produkte WHERE idProdukt = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Kein Produkt gefunden" });
    }

    return res.status(200).json({ data: rows[0] });
  } catch (error) {
    console.error("DB Fehler:", error);
    return res.status(500).json({ message: "Serverfehler" });
  }
});

export default router;
