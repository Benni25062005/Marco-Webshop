import db from "../config/db.js";

function ts() {
  return new Date().toISOString();
}

export async function saveOrder(orderData) {
  return new Promise((resolve, reject) => {
    const rid = `ORDDBG-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const t0 = Date.now();

    console.log(`[${ts()}] [${rid}] saveOrder START`, {
      idUser: orderData?.idUser,
      currency: orderData?.currency,
      shippingCost: orderData?.shippingCost,
      totalAmount: orderData?.totalAmount,
      itemsCount: Array.isArray(orderData?.items)
        ? orderData.items.length
        : "not-array",
    });

    // Hard timeout (damit es nicht ewig hängt)
    const hardTimeout = setTimeout(() => {
      console.error(`[${ts()}] [${rid}] HARD TIMEOUT >20s (request hangs)`);
      reject(new Error("saveOrder timeout >20s"));
    }, 20000);

    const done = (fn, value) => {
      clearTimeout(hardTimeout);
      const ms = Date.now() - t0;
      fn(value);
      console.log(`[${ts()}] [${rid}] saveOrder END after ${ms}ms`);
    };

    db.getConnection((err, connection) => {
      if (err) {
        console.error(`[${ts()}] [${rid}] getConnection ERROR`, err);
        return done(reject, err);
      }

      const fail = (step, e) => {
        console.error(`[${ts()}] [${rid}] FAIL at ${step}`, e?.message || e, e);
        connection.rollback(() => {
          connection.release();
          return done(reject, e instanceof Error ? e : new Error(String(e)));
        });
      };

      console.log(`[${ts()}] [${rid}] got connection`);

      connection.beginTransaction((err) => {
        if (err) {
          console.error(`[${ts()}] [${rid}] beginTransaction ERROR`, err);
          connection.release();
          return done(reject, err);
        }

        console.log(`[${ts()}] [${rid}] TX started`);

        try {
          const {
            idUser,
            items,
            currency = "CHF",
            shippingCost = 0,
            totalAmount,
            shipping = {},
          } = orderData;

          if (!idUser)
            return fail("validate:idUser", new Error("idUser fehlt"));
          if (!Array.isArray(items) || items.length === 0)
            return fail("validate:items", new Error("Keine Items übergeben"));

          const total = Number(totalAmount);
          if (!Number.isFinite(total) || total <= 0)
            return fail(
              "validate:totalAmount",
              new Error("totalAmount fehlt oder ungültig"),
            );

          const shipCost = Number(shippingCost);
          if (!Number.isFinite(shipCost) || shipCost < 0)
            return fail(
              "validate:shippingCost",
              new Error("shippingCost ungültig"),
            );

          const shipping_name = shipping?.name || null;
          const shipping_street = shipping?.street || null;
          const shipping_zip = shipping?.zip || null;
          const shipping_city = shipping?.city || null;
          const shipping_country = (shipping?.country || "CH").toString();

          console.log(`[${ts()}] [${rid}] INSERT orders ...`, {
            idUser,
            currency,
            shipCost,
            total,
            shipping_country,
            shipping_city,
          });

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
              if (err) return fail("query:insert orders", err);

              const orderId = resOrder.insertId;
              const orderNo = `ORD-${new Date().getFullYear()}-${String(orderId).padStart(6, "0")}`;
              console.log(`[${ts()}] [${rid}] INSERT orders OK`, {
                orderId,
                orderNo,
              });

              console.log(`[${ts()}] [${rid}] UPDATE orders.order_no ...`);
              connection.query(
                "UPDATE orders SET order_no = ? WHERE order_id = ?",
                [orderNo, orderId],
                (err) => {
                  if (err) return fail("query:update order_no", err);

                  console.log(`[${ts()}] [${rid}] UPDATE order_no OK`);

                  // itemsValues bauen + loggen (auch: was geht rein)
                  let itemsValues;
                  try {
                    itemsValues = items.map((it, idx) => {
                      const pid = it.product_id;
                      const qty = Number(it.quantity ?? 1);
                      const unit = Number(it.unit_price ?? it.unitPrice ?? 0);

                      if (!pid)
                        throw new Error(`items[${idx}].product_id fehlt`);
                      if (!Number.isFinite(qty) || qty <= 0)
                        throw new Error(`items[${idx}].quantity ungültig`);
                      if (!Number.isFinite(unit) || unit < 0)
                        throw new Error(`items[${idx}].unit_price ungültig`);

                      const lineTotal = Number((unit * qty).toFixed(2));
                      return [orderId, pid, qty, unit, lineTotal];
                    });
                  } catch (e) {
                    return fail("build:itemsValues", e);
                  }

                  console.log(`[${ts()}] [${rid}] INSERT order_items ...`, {
                    count: itemsValues.length,
                    first: itemsValues[0],
                  });

                  connection.query(
                    "INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES ?",
                    [itemsValues],
                    (err) => {
                      if (err) return fail("query:insert order_items", err);

                      console.log(`[${ts()}] [${rid}] INSERT order_items OK`);

                      console.log(`[${ts()}] [${rid}] COMMIT ...`);
                      connection.commit((err) => {
                        if (err) return fail("commit", err);

                        console.log(`[${ts()}] [${rid}] COMMIT OK`);
                        connection.release();

                        return done(resolve, {
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
          return fail("catch:outer", e);
        }
      });
    });
  });
}
