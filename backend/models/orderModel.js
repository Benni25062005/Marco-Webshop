import db from "../config/db.js";

export const saveOrder = (orderData) => {
  return new Promise((resolve, reject) => {
    const orderSql = "INSERT INTO orders (idUser) VALUES (?)";
    try {
      db.query(orderSql, [orderData.idUser], (err, result) => {
        if (err) return reject(err);
        const orderId = result.insertId;

        const order_no = "9999";
        const orderNoSql = "UPDATE orders SET order_no = ? WHERE id = ?";

        db.query(orderNoSql, [order_no, orderId], (err1) => {
          if (err1) return reject(err1);
        })


        const itemsSql =
          "INSERT INTO order_items (order_id, product_id, quantity) VALUES ?";
        const itemsValues = orderData.items.map((item) => [
          orderId,
          item.product_id,
          item.quantity,
        ]);
        db.query(itemsSql, [itemsValues], (err2) => {
          if (err2) return reject(err2);
          resolve(orderId);
        });
      });
    } catch (error) {
      console.error("Order creaton failed", error);
      reject(error);
    }
  });
};
