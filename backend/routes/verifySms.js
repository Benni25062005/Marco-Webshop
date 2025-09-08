import db from "../config/db.js";
import express from "express";

const router = express.Router();

router.post("/verify-sms-code", async (req, res) => {
  const { idUser, code } = req.body;

  if (!idUser || !code) {
    console.error("Fehlende Daten");
    return res.status(400).json({ message: "Fehlende Daten" });
  }

  try {
    // Code aus DB holen
    const [rows] = await db.execute(
      "SELECT phoneCode FROM user WHERE idUser = ?",
      [idUser]
    );

    if (rows.length === 0) {
      console.error("Benutzer wurde nicht gefunden");
      return res.status(404).json({ message: "Benutzer nicht gefunden" });
    }

    if (rows[0].phoneCode === code) {
      // Nummer verifizieren
      await db.execute("UPDATE user SET isVerifiedPhone = 1 WHERE idUser = ?", [
        idUser,
      ]);
      return res.status(200).json({ message: "Telefonnummer verifiziert" });
    } else {
      console.error("Falscher Code");
      return res.status(401).json({ message: "Falscher Code" });
    }
  } catch (err) {
    console.error("Fehler bei /verify-sms-code:", err);
    return res
      .status(500)
      .json({ message: "Fehler beim Verifizieren", error: err });
  }
});

export default router;
