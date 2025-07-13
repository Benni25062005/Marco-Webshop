import db from "../config/db.js";

export function saveCodeToDB(idUser, code) {
  return new Promise((resolve, reject) => {
    const q = "UPDATE user SET phoneCode = ?, phoneCodeCreatedAt = NOW() WHERE idUser = ?";
    db.query(q, [code, idUser], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}

export function getCodeFromDB(idUser) {
  return new Promise((resolve, reject) => {
    const q = "SELECT phoneCode FROM user WHERE idUser = ?";
    db.query(q, [idUser], (err, data) => {
      if (err || data.length === 0) return reject(err || new Error("Kein Benutzer"));
      resolve(data[0].phoneCode);
    });
  });
}

export function markPhoneAsVerified(idUser) {
  return new Promise((resolve, reject) => {
    const q = "UPDATE user SET isVerifiedPhone = 1 WHERE idUser = ?";
    db.query(q, [idUser], (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
}
