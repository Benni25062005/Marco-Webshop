import db from '../config/db.js';

export const checkIfEmailExists = (email) => {
  return new Promise((resolve, reject) => {
    db.query("SELECT idUser FROM user WHERE email = ?", [email], (err, result) => {
      if (err) return reject(err);
      resolve(result.length > 0);
    });
  });
};

export const insertNewUser = (user) => {
  const q = `
    INSERT INTO user (email, password, vorname, nachname, telefonnummer, strasse, plz, ort, land, emailToken, isVerifiedEmail)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

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
    0
  ];

  return new Promise((resolve, reject) => {
    db.query(q, values, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};
