import express from "express";
import mysql from "mysql";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import db from "./config/db.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { authenticateToken, requireAdmin } from "./middleware/auth.js";

import smsRoutes from "./routes/smsRoutes.js";

//Routes
import { productRouter } from "./routes/productRoutes.js";
import { productDetailRouter } from "./routes/productDetailRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
// import { paymentRoutes } from "./routes/paymentRoutes.js"; // Stripe - deaktiviert
import { twintRoutes } from "./routes/twintRoutes.js";
import { orderRoutes } from "./routes/orderRoutes.js";
import { getOrderRoutes } from "./routes/getOrderRoutes.js";
import { authRoutes } from "./routes/authRoutes.js";
import { contactRouter } from "./routes/contactRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cookieParser());
app.use(express.json());

const allowlist = [
  "http://localhost:1234",
  "http://localhost:3000",
  "http://localhost:5173",
  "https://marco-webshop-qu3m.vercel.app",
];
const vercelPreviewRegex = /\.vercel\.app$/;

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true); // Postman/cURL
    const ok = allowlist.includes(origin) || vercelPreviewRegex.test(origin);
    return ok ? cb(null, true) : cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

app.get("/health/db", async (_req, res) => {
  try {
    await db.execute("SELECT 1 AS ok");
    res.json({ db: "ok" });
  } catch (err) {
    res.status(500).json({ error: err.code || String(err) });
  }
});
try {
  const [rows] = await db.execute("SELECT NOW() as now");
  console.log("DB connected. Current time:", rows[0].now);
} catch (err) {
  console.error("DB startup error:", err);
}

app.get("/", (_req, res) => res.json("hello this is the backend"));

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api/contact", contactLimiter, contactRouter);

//#region Produkte

app.use("/api", productRouter);

app.use("/api", productDetailRouter);

app.get("/produkte", async (req, res) => {
  try {
    const kategorie = req.query.kategorie;

    const q = kategorie
      ? "SELECT * FROM produkte WHERE kategorie = ?"
      : "SELECT * FROM produkte";

    const values = kategorie ? [kategorie] : [];

    const [rows] = await db.execute(q, values); // <- execute statt query

    const transformed = rows.map((item) => ({
      ...item,
      Details: item.Details ? JSON.parse(item.Details) : null,
    }));

    return res.json(transformed);
  } catch (err) {
    console.error("Fehler bei /produkte:", err);
    return res.status(500).json({ error: err.code || String(err) });
  }
});

app.get("/produkte/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const kategorie = req.query.kategorie;

    const q = kategorie
      ? "SELECT * FROM produkte WHERE idProdukt = ? AND kategorie = ?"
      : "SELECT * FROM produkte WHERE idProdukt = ?";

    const values = kategorie ? [id, kategorie] : [id];

    const [rows] = await db.execute(q, values); // <- execute statt query

    if (rows.length > 0) {
      const transformed = rows.map((item) => ({
        ...item,
        Details: item.Details ? JSON.parse(item.Details) : null,
      }));
      return res.json(transformed[0]); // nur das erste Produkt zurück
    } else {
      return res.json({});
    }
  } catch (err) {
    console.error("Fehler bei /produkte/:id:", err);
    return res.status(500).json({ error: err.code || String(err) });
  }
});

//#endregion Produkte

//#region user

app.use("/api/register", userRouter);

app.get("/verify-email", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) {
      return res.status(400).send("Kein Token übergeben");
    }

    const q = `
      UPDATE user
      SET isVerifiedEmail = 1, emailToken = NULL
      WHERE emailToken = ?
    `;

    const [result] = await db.execute(q, [token]); // <- execute statt query

    if (result.affectedRows === 0) {
      return res
        .status(400)
        .send("Ungültiger Token oder E-Mail bereits verifiziert");
    }

    return res.send(
      "E-Mail erfolgreich verifiziert. Sie können sich jetzt anmelden."
    );
  } catch (err) {
    console.error("Fehler bei /verify-email:", err);
    return res.status(500).send("Fehler beim Verifizieren der E-Mail");
  }
});

app.post("/api/login", async (req, res) => {
  try {
    let { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email und Passwort erforderlich" });
    }

    email = String(email).trim().toLowerCase();

    const q = `
      SELECT idUser, email, vorname, nachname, telefonnummer,
             password, strasse, plz, ort, land, isVerifiedEmail, role
      FROM user
      WHERE email = ?
      LIMIT 1
    `;

    const [rows] = await db.execute(q, [email]); // <-- execute statt query
    const user = rows?.[0];
    if (!user)
      return res.status(401).json({ message: "Ungültige Anmeldedaten" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Ungültige Anmeldedaten" });

    if (!user.isVerifiedEmail) {
      return res
        .status(403)
        .json({ message: "Bitte E-Mail-Adresse zuerst bestätigen." });
    }

    const token = jwt.sign(
      { idUser: user.idUser, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Render liefert HTTPS
      sameSite: "none", // Cross-Site (Vercel <-> Render)
      maxAge: 60 * 60 * 1000,
    });

    return res.status(200).json({
      user: {
        idUser: user.idUser,
        email: user.email,
        vorname: user.vorname,
        nachname: user.nachname,
        telefonnummer: user.telefonnummer,
        strasse: user.strasse,
        plz: user.plz,
        ort: user.ort,
        land: user.land,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("/api/login error:", err);
    return res
      .status(500)
      .json({ message: "Serverfehler", error: err.code || String(err) });
  }
});

app.use("/api/user", authRoutes);

app.put("/user/:id/contact", authenticateToken, async (req, res) => {
  const { vorname, nachname, email, telefonnummer } = req.body;
  const idUser = req.params.id;

  if (parseInt(idUser) !== req.user.idUser) {
    return res.status(403).json({ message: "Unbefugter Zugriff" });
  }

  try {
    const q = `
      UPDATE user 
      SET vorname = ?, nachname = ?, email = ?, telefonnummer = ? 
      WHERE idUser = ?
    `;

    const [updateResult] = await db.execute(q, [
      vorname,
      nachname,
      email,
      telefonnummer,
      idUser,
    ]);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    const [rows] = await db.execute("SELECT * FROM user WHERE idUser = ?", [
      idUser,
    ]);

    return res.status(200).json({
      message: "Kontakt wurde erfolgreich gespeichert",
      updatedUser: rows[0],
    });
  } catch (err) {
    console.error("SQL Fehler:", err);
    return res.status(500).json({ error: err });
  }
});

app.put("/user/:id/address", authenticateToken, async (req, res) => {
  const { strasse, plz, ort, land } = req.body;
  const idUser = req.params.id;

  if (parseInt(idUser) !== req.user.idUser) {
    return res.status(403).json({ message: "Unbefugter Zugriff" });
  }

  try {
    const q =
      "UPDATE user SET strasse = ?, plz = ?, ort = ?, land = ? WHERE idUser = ?";
    const values = [strasse, plz, ort, land, idUser];

    const [updateResult] = await db.execute(q, values);

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    const [rows] = await db.execute("SELECT * FROM user WHERE idUser = ?", [
      idUser,
    ]);

    return res.status(200).json({
      message: "Adresse wurde erfolgreich gespeichert",
      updatedUser: rows[0],
    });
  } catch (err) {
    console.error("Fehler beim Aktualisieren der Adresse:", err);
    return res
      .status(500)
      .json({ message: "Fehler beim Aktualisieren der Adresse", error: err });
  }
});

app.get("/user/:id", authenticateToken, async (req, res) => {
  const idUser = req.params.id;

  if (parseInt(idUser) !== req.user.idUser) {
    return res.status(403).json({ message: "Unbefugter Zugriff" });
  }

  try {
    const [rows] = await db.execute("SELECT * FROM user WHERE idUser = ?", [
      idUser,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    return res.status(200).json({ user: rows[0] });
  } catch (err) {
    console.error("Fehler beim Abrufen des Users:", err);
    return res
      .status(500)
      .json({ message: "Fehler beim Abrufen des Users", error: err });
  }
});

app.put("/user/:id/password", authenticateToken, async (req, res) => {
  const idUser = req.params.id;
  const { oldPassword, newPassword } = req.body;

  if (parseInt(idUser) !== req.user.idUser) {
    return res.status(403).json({ message: "Unbefugter Zugriff" });
  }

  try {
    // Altes Passwort holen
    const [rows] = await db.execute(
      "SELECT password FROM user WHERE idUser = ?",
      [idUser]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    const valid = await bcrypt.compare(oldPassword, rows[0].password);
    if (!valid) {
      return res.status(400).json({ message: "Aktuelles Passwort ist falsch" });
    }

    // Neues Passwort hashen
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update in DB
    const [updateResult] = await db.execute(
      "UPDATE user SET password = ? WHERE idUser = ?",
      [hashedPassword, idUser]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    return res
      .status(200)
      .json({ message: "Passwort erfolgreich aktualisiert" });
  } catch (err) {
    console.error("Fehler beim Aktualisieren des Passworts:", err);
    return res.status(500).json({
      message: "Fehler beim Aktualisieren des Passworts",
      error: err,
    });
  }
});

app.put("/user/:id/email", authenticateToken, async (req, res) => {
  const idUser = req.params.id;
  const { email, vorname } = req.body;

  if (parseInt(idUser) !== req.user.idUser) {
    return res.status(403).json({ message: "Unbefugter Zugriff" });
  }

  try {
    const emailToken = crypto.randomBytes(64).toString("hex");

    // E-Mail + Token setzen, Verifizierung zurücksetzen
    const [updateResult] = await db.execute(
      "UPDATE user SET email = ?, emailToken = ?, isVerifiedEmail = 0 WHERE idUser = ?",
      [email, emailToken, idUser]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "User nicht gefunden" });
    }

    // Verifizierungslink (nutze am besten ENV, nicht hart codieren)
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:8800";
    const verificationLink = `${baseUrl}/verify-email?token=${emailToken}`;

    // Mailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Bitte bestätigen Sie Ihre E-Mail-Adresse",
      html: `
        <div style="font-family:Arial, sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px; background:#ffffff;">
          <div style="text-align:center; margin-bottom:32px;">
            <img src="" alt="FeuerTech Logo" style="max-width:120px;" />
          </div>

          <h2 style="color:#dc2626;">Hallo ${vorname || ""},</h2>
          <p style="font-size:16px; color:#111827;">bitte bestätige deine neue E-Mail-Adresse.</p>

          <div style="text-align:center; margin:32px 0;">
            <a href="${verificationLink}"
               style="display:inline-block; padding:14px 28px; background-color:#dc2626; color:#ffffff; text-decoration:none; border-radius:8px; font-weight:600; font-size:16px;">
               Jetzt bestätigen
            </a>
          </div>

          <p style="font-size:12px; color:#6b7280; text-align:center;">Falls du diese Änderung nicht durchgeführt hast, ignoriere diese E-Mail oder kontaktiere den Support.</p>
        </div>
      `,
      text: `Bitte bestätige deine neue E-Mail-Adresse über diesen Link: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);

    const [rows] = await db.execute("SELECT * FROM user WHERE idUser = ?", [
      idUser,
    ]);

    return res.status(200).json({
      message:
        "E-Mail erfolgreich aktualisiert. Bitte überprüfe deine E-Mails zur Bestätigung.",
      updatedUser: rows[0],
    });
  } catch (err) {
    console.error("Fehler beim Aktualisieren/Senden:", err);

    // Kollision auf UNIQUE(email)
    if (err?.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "Diese E-Mail ist bereits vergeben." });
    }

    return res.status(500).json({
      message: "Fehler beim Aktualisieren der E-Mail",
      error: err,
    });
  }
});

app.post("/api/request-reset", async (req, res) => {
  const { email } = req.body;

  // 4-stelliger Code
  const code = Math.floor(1000 + Math.random() * 9000).toString();

  try {
    // User holen
    const [userRows] = await db.execute(
      "SELECT vorname FROM user WHERE email = ?",
      [email]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "E-Mail wurde nicht gefunden" });
    }

    const { vorname } = userRows[0];

    // Code + Timestamp setzen
    const [updateResult] = await db.execute(
      "UPDATE user SET resetCode = ?, resetCodeCreatedAt = NOW() WHERE email = ?",
      [code, email]
    );

    if (updateResult.affectedRows === 0) {
      return res.status(404).json({ message: "E-Mail wurde nicht gefunden" });
    }

    // Mailer (Gmail SMTP – nutze App-Passwort!)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Passwort zurücksetzen",
      html: `
        <div style="font-family:sans-serif; max-width:600px; margin:auto; padding:24px; border:1px solid #e5e7eb; border-radius:12px; background:#f9fafb;">
          <div style="text-align:center; margin-bottom:32px;">
            <h1 style="color:#dc2626;">Knapp Kaminkehrer</h1>
          </div>

          <h2 style="color:#111827;">Hallo ${vorname},</h2>

          <p style="margin:20px 0; font-size:16px">
            Du hast angefordert, dein Passwort zurückzusetzen. Gib den folgenden Bestätigungscode in der App ein:
          </p>

          <div style="text-align:center; margin:30px 0;">
            <span style="font-size:32px; font-weight:bold; letter-spacing:4px; color:#dc2626;">${code}</span>
          </div>

          <p style="color:#6b7280;">Wenn du das nicht warst, kannst du diese E-Mail ignorieren.</p>

          <p style="margin-top:40px; font-size:12px; color:#9ca3af; text-align:center;">© 2025 Knapp Kaminkehrer</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Code wurde gesendet!" });
  } catch (err) {
    console.error("Fehler beim Setzen/Versenden des Reset-Codes:", err);
    return res.status(500).json({
      message: "Fehler beim Setzen oder Versenden des Codes",
      error: err,
    });
  }
});

app.post("/api/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  try {
    // Neues Passwort hashen
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const [updateResult] = await db.execute(
      `
        UPDATE user
        SET password = ?, resetCode = NULL, resetCodeCreatedAt = NULL
        WHERE email = ?
          AND resetCode = ?
          AND TIMESTAMPDIFF(SECOND, resetCodeCreatedAt, NOW()) <= 600
      `,
      [hashedPassword, email, code]
    );

    if (updateResult.affectedRows === 0) {
      // Herausfinden, ob User existiert (für gezieltere Fehlermeldung)
      const [rows] = await db.execute(
        "SELECT resetCode, resetCodeCreatedAt FROM user WHERE email = ?",
        [email]
      );
      if (rows.length === 0) {
        return res.status(404).json({ message: "User nicht gefunden" });
      }

      const u = rows[0];
      if (u.resetCode !== code) {
        return res.status(400).json({ message: "Falscher Code" });
      }
      // Wenn Code stimmt, dann ist er abgelaufen
      return res.status(400).json({ message: "Code abgelaufen" });
    }

    return res.json({ message: "Passwort erfolgreich geändert" });
  } catch (err) {
    console.error("Fehler beim Zurücksetzen des Passworts:", err);
    return res
      .status(500)
      .json({ message: "Fehler beim Zurücksetzen des Passworts", error: err });
  }
});

app.use("/api/sms", smsRoutes);

//#endregion user

//#region Warenkorb
app.get("/api/cartItems", authenticateToken, async (req, res) => {
  const user_id = req.query.user_id;

  if (parseInt(user_id) !== req.user.idUser) {
    return res.status(403).json({ message: "Unbefugter Zugriff" });
  }

  const q = `
    SELECT w.product_id, w.menge, p.Name, p.Preis_brutto, p.Bild, p.stripePriceId
    FROM warenkorb w
    JOIN produkte p ON w.product_id = p.idProdukt
    WHERE w.user_id = ?
  `;

  try {
    const [rows] = await db.execute(q, [user_id]);

    const transformed = rows.map((item) => ({
      ...item,
    }));

    return res.status(200).json(transformed);
  } catch (err) {
    console.error("Fehler beim Abrufen des Warenkorbs:", err);
    return res.status(500).json({
      message: "Fehler beim Abrufen des Warenkorbs",
      error: err,
    });
  }
});

app.post("/api/cart", authenticateToken, async (req, res) => {
  const { user_id, product_id, menge } = req.body;

  if (parseInt(user_id) !== req.user.idUser) {
    return res.status(403).json({ message: "Unbefugter Zugriff" });
  }

  const q = `
    INSERT INTO warenkorb (user_id, product_id, menge)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE menge = menge + VALUES(menge)
  `;
  const values = [user_id, product_id, menge];

  try {
    await db.execute(q, values);

    return res.status(201).json({
      message: "Produkt wurde erfolgreich zum Warenkorb hinzugefügt",
    });
  } catch (err) {
    console.error("Fehler beim Hinzufügen zum Warenkorb:", err);
    return res.status(500).json({
      message: "Fehler beim Hinzufügen zum Warenkorb",
      error: err,
    });
  }
});

app.delete(
  "/api/cart/:user_id/:product_id",
  authenticateToken,
  async (req, res) => {
    const { user_id, product_id } = req.params;

    if (parseInt(user_id) !== req.user.idUser) {
      return res.status(403).json({ message: "Unbefugter Zugriff" });
    }

    const q = "DELETE FROM warenkorb WHERE user_id = ? AND product_id = ?";
    const values = [user_id, product_id];

    try {
      const [result] = await db.execute(q, values);

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Produkt nicht im Warenkorb gefunden" });
      }

      return res.status(200).json({
        message: "Produkt wurde erfolgreich aus dem Warenkorb entfernt",
      });
    } catch (err) {
      console.error("Fehler beim Entfernen aus dem Warenkorb:", err);
      return res.status(500).json({
        message: "Fehler beim Entfernen aus dem Warenkorb",
        error: err,
      });
    }
  }
);

app.put(
  "/api/cart/:user_id/:product_id",
  authenticateToken,
  async (req, res) => {
    const { user_id, product_id } = req.params;
    const { menge } = req.body;

    if (parseInt(user_id) !== req.user.idUser) {
      return res.status(403).json({ message: "Unbefugter Zugriff" });
    }

    const q =
      "UPDATE warenkorb SET menge = ? WHERE user_id = ? AND product_id = ?";
    const values = [menge, user_id, product_id];

    try {
      const [result] = await db.execute(q, values);

      if (result.affectedRows === 0) {
        return res
          .status(400)
          .json({ message: "Produkt nicht im Warenkorb gefunden" });
      }

      return res
        .status(200)
        .json({ message: "Menge erfolgreich aktualisiert" });
    } catch (err) {
      console.error("Fehler beim Aktualisieren der Menge:", err);
      return res.status(500).json({
        message: "Fehler beim Aktualisieren der Menge",
        error: err,
      });
    }
  }
);

app.delete("/api/cart/:userId", authenticateToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const dbUserId = parseInt(userId);
    const tokenUserId = parseInt(req.user.idUser);

    if (dbUserId !== tokenUserId) {
      return res.status(403).json({ message: "Unbefugter Zugriff" });
    }

    const [result] = await db.execute(
      "DELETE FROM warenkorb WHERE user_id = ?",
      [userId]
    );

    if (result.affectedRows === 0) {
      return res.status(200).json({ message: "Warenkorb war bereits leer" });
    }

    return res.status(200).json({ message: "Warenkorb erfolgreich geleert" });
  } catch (error) {
    console.error("Fehler beim Leeren des Warenkorbs:", error);
    return res
      .status(500)
      .json({ error: "Fehler beim Leeren des Warenkorbs", details: error });
  }
});

//#endregion Warenkorb

//#region Checkout

// app.use("/api/payments", paymentRoutes); // Stripe - deaktiviert
app.use("/api/twint", twintRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/orders", getOrderRoutes);

//#endregion Checkout

//#region Admin

app.use("/api/admin", adminRoutes);

//#endregion Admin

const port = process.env.PORT || 8800;

app.listen(port, () => {
  console.log("Connected to backend!", port);
});
