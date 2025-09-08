import db from "../config/db.js";

export const checkIfEmailExists = async (email) => {
  const sql = "SELECT idUser FROM user WHERE email = ?";
  try {
    const [rows] = await db.execute(sql, [email]);
    return rows.length > 0;
  } catch (err) {
    console.error("Fehler bei checkIfEmailExists:", err);
    throw err;
  }
};

export const insertNewUser = async (user) => {
  const sql = `
    INSERT INTO user (
      email, password, vorname, nachname, telefonnummer,
      strasse, plz, ort, land, emailToken, isVerifiedEmail
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    user.email,
    user.hashedPassword,
    user.vorname,
    user.nachname,
    user.telefonnummer,
    user.strasse,
    user.plz,
    user.ort,
    user.land,
    user.emailToken,
    0,
  ];

  try {
    const [result] = await db.execute(sql, values);
    return result.insertId; // sinnvoller als einfach data zurückgeben
  } catch (err) {
    console.error("Fehler bei insertNewUser:", err);
    throw err;
  }
};
