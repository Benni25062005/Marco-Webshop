import db from "../config/db.js";

export async function saveOrder(orderData) {
  return new Promise((resolve, reject) => {
    db.getConnection((err, connection) => {
      if (err) return reject(err);

      const fail = (e) => {
        connection.rollback(() => {
          connection.release();
          reject(e);
        });
      };

      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject(err);
        }

        try {
          const {
            idUser,
            items,
            currency = "CHF",
            shippingCost = 0,
            totalAmount,
            shipping = {},
          } = orderData;

          if (!idUser) return fail(new Error("idUser fehlt"));
          if (!Array.isArray(items) || items.length === 0)
            return fail(new Error("Keine Items übergeben"));

          const total = Number(totalAmount);
          if (!Number.isFinite(total) || total <= 0)
            return fail(new Error("totalAmount fehlt oder ungültig"));

          const shipCost = Number(shippingCost);
          if (!Number.isFinite(shipCost) || shipCost < 0)
            return fail(new Error("shippingCost ungültig"));

          const shipping_name = shipping?.name || null;
          const shipping_street = shipping?.street || null;
          const shipping_zip = shipping?.zip || null;
          const shipping_city = shipping?.city || null;
          const shipping_country = shipping?.country || "CH";

          connection.query(
            `INSERT INTO orders
             (idUser, status, currency, shipping_cost, total_amount,
              shipping_name, shipping_street, shipping_zip, shipping_city, shipping_country,
              payment_provider, payment_status)
             VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, 'saferpay', 'created')`,
            [
              idUser,
              currency,
              shipCost,
              total,
              shipping_name,
              shipping_street,
              shipping_zip,
              shipping_city,
              shipping_country,
            ],
            (err, resOrder) => {
              if (err) return fail(err);

              const orderId = resOrder.insertId;
              const orderNo = `ORD-${new Date().getFullYear()}-${String(orderId).padStart(6, "0")}`;

              connection.query(
                "UPDATE orders SET order_no = ? WHERE order_id = ?",
                [orderNo, orderId],
                (err) => {
                  if (err) return fail(err);

                  // itemsValues SAFE bauen (kein throw mehr ohne catch)
                  let itemsValues;
                  try {
                    itemsValues = items.map((it) => {
                      const pid = it.product_id;
                      const qty = Number(it.quantity ?? 1);
                      const unit = Number(it.unit_price ?? it.unitPrice ?? 0);

                      if (!pid) throw new Error("product_id fehlt");
                      if (!Number.isFinite(qty) || qty <= 0)
                        throw new Error("quantity ungültig");
                      if (!Number.isFinite(unit) || unit < 0)
                        throw new Error("unit_price ungültig");

                      const lineTotal = Number((unit * qty).toFixed(2));
                      return [orderId, pid, qty, unit, lineTotal];
                    });
                  } catch (e) {
                    return fail(e);
                  }

                  connection.query(
                    "INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES ?",
                    [itemsValues],
                    (err) => {
                      if (err) return fail(err);

                      connection.commit((err) => {
                        if (err) return fail(err);

                        connection.release();
                        resolve({
                          order_id: orderId,
                          order_no: orderNo,
                          success: true,
                        });
                      });
                    },
                  );
                },
              );
            },
          );
        } catch (e) {
          return fail(e);
        }
      });
    });
  });
}
