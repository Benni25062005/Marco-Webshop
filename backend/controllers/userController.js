import { checkIfEmailExists, insertNewUser } from "../models/userModel.js";
import { sendVerificationEmail } from "../utils/mailer.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export const registerUser = async (req, res) => {
  const {
    email,
    password,
    vorname,
    nachname,
    telefonnummer,
    strasse,
    plz,
    ort,
    land,
  } = req.body;

  try {
    const exists = await checkIfEmailExists(email);
    console.log("checkifemailexsitsr returen", exists);
    if (exists) {
      return res
        .status(400)
        .json({ message: "E-Mail ist bereits registriert!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailToken = crypto.randomBytes(64).toString("hex");

    try {
      await insertNewUser({
        email,
        hashedPassword,
        vorname,
        nachname,
        telefonnummer,
        strasse,
        plz,
        ort,
        land,
        emailToken,
      });
    } catch (error) {
      console.error("Fehler beim Insert:", error);
      return res.status(500).json({ message: "Fehler beim Speichern", error });
    }

    await sendVerificationEmail(email, vorname, emailToken);

    res.status(201).json({
      message: "User erfolgreich erstellt. Bitte bestätigen Sie Ihre E-Mail.",
    });
  } catch (error) {
    console.error("Fehler beim Registrieren:", error);
    res.status(500).json({ message: "Fehler beim Registrieren", error });
  }
};
