import db from "../config/db.js";

export const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT idUser, email, vorname, nachname, telefonnummer, strasse, plz, ort, land FROM user WHERE idUser = ?";
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result[0]);
    });
  });
};
