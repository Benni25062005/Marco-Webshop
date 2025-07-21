import db from "../config/db.js";

export const saveOrder = (orderData) => {
  return new Promise((resolve, reject) => {
    const orderSql = "INSERT INTO orders (idUser) VALUES (?)";
    try {
      db.query(orderSql, [orderData.idUser], (err, result) => {
        if (err) return reject(err);
        const orderId = result.insertId;

        console.log("order items", orderData.items);
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
