import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { sendVerificationCode } from "../services/smsService.js";
import db from "../config/db.js";

const router = express.Router();

router.post("/send-sms-code", async (req, res) => {
  console.log(req.body);

  const { phone, idUser } = req.body;

  if (!phone) {
    console.error("Keine Telefonnummer gefunden");
    return res.status(400).json({ message: "Telefonnummer fehlt" });
  }

  try {
    // 1) SMS senden
    const code = await sendVerificationCode(phone);

    // 2) Code in DB speichern
    const q =
      "UPDATE user SET phoneCode = ?, phoneCodeCreatedAt = NOW() WHERE idUser = ?";
    await db.execute(q, [code, idUser]); // <-- execute statt query

    return res
      .status(200)
      .json({ message: "Code wurde erfolgreich gesendet!" });
  } catch (err) {
    console.error("Fehler bei /send-sms-code:", err);
    return res
      .status(500)
      .json({ message: "SMS konnte nicht gesendet oder gespeichert werden" });
  }
});

export default router;
