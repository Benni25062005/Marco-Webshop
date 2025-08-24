import db from "../config/db.js";

export const getOrder = (idUser) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT o.order_id, o.order_no, o.created_at, oi.product_id, oi.quantity, 
             p.name, p.Preis_brutto, p.Bild
      FROM orders o
      INNER JOIN order_items oi ON o.order_id = oi.order_id
      INNER JOIN produkte p ON oi.product_id = p.idProdukt
      WHERE o.idUser = ?
      ORDER BY o.created_at DESC
    `;

    db.query(sql, [idUser], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};
