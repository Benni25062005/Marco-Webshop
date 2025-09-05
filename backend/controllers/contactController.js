import { sendContactEmail } from "../utils/contactMailer.js";
import { verifyTurnstile } from "../utils/turnstile.js";

export async function postContact(req, res) {
  try {
    const {
      vorname = "",
      nachname = "",
      email = "",
      nachricht = "",
      cf_token,
    } = req.body;

    // 1) Turnstile prüfen
    const ip = req.headers["cf-connecting-ip"] || req.ip; // 👈 richtig
    const v = await verifyTurnstile(cf_token, ip);
    if (!v.success) {
      console.warn("Turnstile fail:", v["error-codes"]);
      return res.status(400).json({ message: "Captcha ungültig" });
    }

    // 2) Basic Validation
    const t = (s) => String(s).trim();
    const payload = {
      vorname: t(vorname),
      nachname: t(nachname),
      email: t(email),
      nachricht: t(nachricht),
    };

    if (
      !payload.vorname ||
      !payload.nachname ||
      !payload.email ||
      !payload.nachricht
    ) {
      return res
        .status(400)
        .json({ message: "Alle Felder müssen ausgefüllt werden." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
      return res.status(400).json({ message: "E-Mail-Adresse ungültig." });
    }
    if (payload.nachricht.length > 2000) {
      return res
        .status(400)
        .json({ message: "Nachricht ist zu lang (max. 2000 Zeichen)." });
    }

    // 3) Mail senden
    await sendContactEmail(payload);
    return res
      .status(200)
      .json({ message: "Kontaktanfrage erfolgreich gesendet" });
  } catch (err) {
    console.error("Fehler beim Senden der Kontaktanfrage:", err);
    return res
      .status(500)
      .json({ message: "Fehler beim Senden der Kontaktanfrage" });
  }
}
