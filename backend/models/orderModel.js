import db from "../config/db.js";

// einfache Ordernummer: YYYYMMDD-<orderId mit 5 Stellen>
const makeOrderNo = (orderId) => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}-${String(orderId).padStart(5, "0")}`;
};

export const saveOrder = async (orderData) => {
  const conn = await db.getConnection(); // db ist ein mysql2/promise Pool
  try {
    await conn.beginTransaction();

    // 1) Order anlegen
    const [orderRes] = await conn.execute(
      "INSERT INTO orders (idUser) VALUES (?)",
      [orderData.idUser]
    );
    const orderId = orderRes.insertId;

    // 2) Ordernummer setzen (bitte: nicht "9999")
    const order_no = makeOrderNo(orderId);
    await conn.execute(
      "UPDATE orders SET order_no = ? WHERE order_id = ?",
      [order_no, orderId] // <-- richtiger PK/Spaltenname
    );

    // 3) Positionen einfügen (Bulk Insert)
    if (Array.isArray(orderData.items) && orderData.items.length > 0) {
      const itemsValues = orderData.items.map((item) => [
        orderId,
        item.product_id,
        item.quantity,
      ]);

      // Für Bulk-Insert mit Platzhalter-Array -> mysql2: query() verwenden
      await conn.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES ?",
        [itemsValues]
      );
    }

    await conn.commit();
    return orderId;
  } catch (err) {
    await conn.rollback();
    console.error("Order creation failed:", err);
    throw err;
  } finally {
    conn.release();
  }
};
