import db from "../config/db.js";

export const getUserById = async (id) => {
  const sql = `
    SELECT idUser, email, vorname, nachname, telefonnummer, strasse, plz, ort, land
    FROM user
    WHERE idUser = ?
  `;

  try {
    const [rows] = await db.execute(sql, [id]);
    if (rows.length === 0) return null;
    return rows[0];
  } catch (err) {
    console.error("Fehler bei getUserById:", err);
    throw err;
  }
};
