import { db } from "../db.js";
import express from "express";

const router = express.Router();

router.post("/verify-sms-code", (req, res) => {
  const { idUser, code } = req.body;

  if (!idUser || !code) {
    console.error("Fehlende Daten");
    return res.status(400).json({ message: "Fehlende Daten" });
  }

  const q = "SELECT phoneCode FROM user WHERE idUser = ?";
  db.query(q, [idUser], (err, data) => {
    if (err || data.length === 0) {
      console.error("Benutzer wurde nicht gefunden");
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    if (data[0].phoneCode === code) {
      const updateQuery = "UPDATE user SET isVerifiedPhone = 1 WHERE idUser = ?";
      db.query(updateQuery, [idUser], (err) => {
        if (err) {
          console.error("Fehler beim Aktualisieren");
          return res.status(500).json({ message: "Fehler beim Aktualisieren" });
        }
        return res.status(200).json({ message: "Telefonnummer verifiziert" });
      });
    } else {
      console.error("Falscher Code");
      return res.status(401).json({ message: "Falscher Code" });
    }
  });
});

export default router;
