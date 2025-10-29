import express from "express";
import db from "../config/db.js";
import { reservationsUrl } from "twilio/lib/jwt/taskrouter/util.js";
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

router.get("/products/categories", async (_req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT DISTINCT TRIM(LOWER(Kategorie)) AS Kategorie
      FROM produkte
      WHERE Kategorie IS NOT NULL AND Kategorie <> ''
      ORDER BY Kategorie
    `);
    res.json({ data: rows.map((r) => r.Kategorie) });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Interner Serverfehler" });
  }
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

router.put("/products/edit/:id", async (req, res) => {
  const {
    Name,
    Kategorie,
    Beschreibung,
    Preis_netto,
    Preis_brutto,
    Bild,
    Details,
  } = req.body;
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ message: "Keine Id vorhanden" });
  }

  try {
    const q = `
      UPDATE produkte 
      SET Name = ?, Kategorie = ?, Beschreibung = ?, Preis_netto = ?, Preis_brutto = ?, Bild = ?, Details = ?
      WHERE idProdukt = ? 
    `;

    const [result] = await db.execute(q, [
      Name,
      Kategorie,
      Beschreibung,
      Preis_netto,
      Preis_brutto,
      Bild,
      Details,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Produkt nicht gefunden" });
    }

    const [rows] = await db.execute(
      "SELECT * FROM produkte WHERE idProdukt = ?",
      [id]
    );

    return res.status(200).json({
      message: "Produkt wurde erfolgreich gespeichert",
      updatedProduct: rows[0],
    });
  } catch (err) {
    console.error("SQL Fehler:", err);
    return res.status(500).json({ error: err });
  }
});

router.post("/products/save", async (req, res) => {
  let {
    Name,
    Kategorie,
    Beschreibung,
    Bild,
    Preis_netto,
    Preis_brutto,
    Details,
  } = req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO produkte (Name, Kategorie, Beschreibung, Bild, Preis_netto, Preis_brutto, Details)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        Name ?? null,
        Kategorie ?? null,
        Beschreibung ?? null,
        Bild ?? null,
        Preis_netto ?? null,
        Preis_brutto ?? null,
        Details ?? null,
      ]
    );

    return res
      .status(201)
      .json({ message: "Produkt erstellt", id: result.insertId });
  } catch (err) {
    console.error("SQL Fehler:", err);
    return res.status(500).json({ error: "Interner Serverfehler" });
  }
});

export default router;
