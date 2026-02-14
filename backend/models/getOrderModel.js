import db from "../config/db.js";

export const getOrder = async (idUser) => {
  const sql = `
  SELECT o.order_id, o.order_no, o.created_at, o.status, o.total_amount, o.currency, o.payment_status,
       oi.product_id, oi.quantity, oi.unit_price, oi.line_total,
       p.Name, p.Bild
  `;

  try {
    const [rows] = await db.execute(sql, [idUser]);
    return rows;
  } catch (err) {
    console.error("Fehler bei getOrder:", err);
    throw err;
  }
};
