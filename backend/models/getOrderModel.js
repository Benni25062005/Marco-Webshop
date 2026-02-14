import db from "../config/db.js";

export const getOrder = async (idUser) => {
  const sql = `
    SELECT
      o.order_id,
      o.order_no,
      o.created_at,
      o.status,
      o.total_amount,
      o.currency,
      o.payment_status,
      o.shipping_cost,
      o.shipping_name,
      o.shipping_street,
      o.shipping_zip,
      o.shipping_city,
      o.shipping_country,

      oi.order_items_id,
      oi.product_id,
      oi.quantity,
      oi.unit_price,
      oi.line_total,

      p.Name,
      p.Bild
    FROM orders o
    JOIN order_items oi ON oi.order_id = o.order_id
    JOIN produkte p ON p.idProdukt = oi.product_id
    WHERE o.idUser = ?
    ORDER BY o.created_at DESC, oi.order_items_id ASC
  `;

  const [rows] = await db.execute(sql, [idUser]);
  return rows;
};
