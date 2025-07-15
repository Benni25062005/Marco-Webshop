import db from "../config/db.js";

export const getAllProducts = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM produkte', (err, results) => {
            if (err) return reject(err);
            resolve(results);
        });
    });
};
