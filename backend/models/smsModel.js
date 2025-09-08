import db from "../config/db.js";

export async function saveCodeToDB(idUser, code) {
  const q = `
    UPDATE user
    SET phoneCode = ?, phoneCodeCreatedAt = NOW()
    WHERE idUser = ?
  `;
  try {
    await db.execute(q, [code, idUser]);
  } catch (err) {
    console.error("Fehler bei saveCodeToDB:", err);
    throw err;
  }
}

export async function getCodeFromDB(idUser) {
  const q = "SELECT phoneCode FROM user WHERE idUser = ?";
  try {
    const [rows] = await db.execute(q, [idUser]);
    if (rows.length === 0) {
      throw new Error("Kein Benutzer gefunden");
    }
    return rows[0].phoneCode;
  } catch (err) {
    console.error("Fehler bei getCodeFromDB:", err);
    throw err;
  }
}

export async function markPhoneAsVerified(idUser) {
  const q = "UPDATE user SET isVerifiedPhone = 1 WHERE idUser = ?";
  try {
    await db.execute(q, [idUser]);
  } catch (err) {
    console.error("Fehler bei markPhoneAsVerified:", err);
    throw err;
  }
}
