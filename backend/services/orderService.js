// services/orderService.js
import db from "../config/db.js";

export async function saveOrder(orderData) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject(err);
        }

        const { idUser, items } = orderData;

        if (!idUser) {
          connection.rollback(() => connection.release());
          return reject(new Error("idUser fehlt"));
        }
        if (!Array.isArray(items) || items.length === 0) {
          connection.rollback(() => connection.release());
          return reject(new Error("Keine Items übergeben"));
        }

        // 1) Order anlegen
        connection.query(
          "INSERT INTO orders (idUser) VALUES (?)",
          [idUser],
          (err, resOrder) => {
            if (err) {
              connection.rollback(() => connection.release());
              return reject(err);
            }

            const orderId = resOrder.insertId;

            // 2) Lesbare Order-Nr, z.B. ORD-2025-000123
            const orderNo = `ORD-${new Date().getFullYear()}-${String(
              orderId
            ).padStart(6, "0")}`;

            // 3) order_no setzen
            connection.query(
              "UPDATE orders SET order_no = ? WHERE order_id = ?",
              [orderNo, orderId],
              (err) => {
                if (err) {
                  connection.rollback(() => connection.release());
                  return reject(err);
                }

                // 4) Überprüfen, ob order_no erfolgreich gesetzt wurde
                connection.query(
                  "SELECT order_no FROM orders WHERE order_id = ?",
                  [orderId],
                  (err, checkResult) => {
                    if (err) {
                      connection.rollback(() => connection.release());
                      return reject(err);
                    }

                    if (!checkResult[0]?.order_no) {
                      connection.rollback(() => connection.release());
                      return reject(
                        new Error("Fehler beim Setzen der Bestellnummer")
                      );
                    }

                    // 5) Order Items einfügen
                    const itemsValues = items.map((it) => [
                      orderId,
                      it.product_id,
                      it.quantity,
                    ]);

                    connection.query(
                      "INSERT INTO order_items (order_id, product_id, quantity) VALUES ?",
                      [itemsValues],
                      (err) => {
                        if (err) {
                          connection.rollback(() => connection.release());
                          return reject(err);
                        }

                        // 6) Transaction committen
                        connection.commit((err) => {
                          if (err) {
                            connection.rollback(() => connection.release());
                            return reject(err);
                          }

                          connection.release();
                          resolve({ orderId, orderNo });
                        });
                      }
                    );
                  }
                );
              }
            );
          }
        );
      });
    });
  });
}
