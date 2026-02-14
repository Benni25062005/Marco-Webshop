import db from "../config/db.js";

const ts = () => new Date().toISOString();

export async function saveOrder(orderData) {
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

  let conn;
  try {
    console.log(`[${ts()}] [${rid}] getConnection...`);
    conn = await db.getConnection();
    console.log(`[${ts()}] [${rid}] got connection`);

    await conn.beginTransaction();
    console.log(`[${ts()}] [${rid}] TX started`);

    const {
      idUser,
      items,
      currency = "CHF",
      shippingCost = 0,
      totalAmount,
      shipping = {},
    } = orderData;

    if (!idUser) throw new Error("idUser fehlt");
    if (!Array.isArray(items) || items.length === 0)
      throw new Error("Keine Items übergeben");

    const total = Number(totalAmount);
    if (!Number.isFinite(total) || total <= 0)
      throw new Error("totalAmount fehlt oder ungültig");

    const shipCost = Number(shippingCost);
    if (!Number.isFinite(shipCost) || shipCost < 0)
      throw new Error("shippingCost ungültig");

    const shipping_name = shipping?.name || null;
    const shipping_street = shipping?.street || null;
    const shipping_zip = shipping?.zip || null;
    const shipping_city = shipping?.city || null;
    const shipping_country = shipping?.country || "CH";

    // ✅ order_no muss beim INSERT gesetzt sein (weil DB kein Default erlaubt)
    const placeholderOrderNo = `TMP-${Date.now()}-${Math.random().toString(16).slice(2)}`;

    console.log(`[${ts()}] [${rid}] INSERT orders...`);
    const [resOrder] = await conn.execute(
      `INSERT INTO orders
       (idUser, order_no, status, currency, shipping_cost, total_amount,
        shipping_name, shipping_street, shipping_zip, shipping_city, shipping_country,
        payment_provider, payment_status)
       VALUES (?, ?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, 'saferpay', 'created')`,
      [
        idUser,
        placeholderOrderNo,
        currency,
        shipCost,
        total,
        shipping_name,
        shipping_street,
        shipping_zip,
        shipping_city,
        shipping_country,
      ],
    );

    const orderId = resOrder.insertId;
    const orderNo = `ORD-${new Date().getFullYear()}-${String(orderId).padStart(6, "0")}`;
    console.log(`[${ts()}] [${rid}] INSERT orders OK`, { orderId, orderNo });

    console.log(`[${ts()}] [${rid}] UPDATE order_no...`);
    await conn.execute("UPDATE orders SET order_no = ? WHERE order_id = ?", [
      orderNo,
      orderId,
    ]);
    console.log(`[${ts()}] [${rid}] UPDATE order_no OK`);

    const itemsValues = items.map((it, idx) => {
      const pid = it.product_id;
      const qty = Number(it.quantity ?? 1);
      const unit = Number(it.unit_price ?? it.unitPrice ?? 0);

      if (!pid) throw new Error(`items[${idx}].product_id fehlt`);
      if (!Number.isFinite(qty) || qty <= 0)
        throw new Error(`items[${idx}].quantity ungültig`);
      if (!Number.isFinite(unit) || unit < 0)
        throw new Error(`items[${idx}].unit_price ungültig`);

      const lineTotal = Number((unit * qty).toFixed(2));
      return [orderId, pid, qty, unit, lineTotal];
    });

    console.log(`[${ts()}] [${rid}] INSERT order_items...`, {
      count: itemsValues.length,
      first: itemsValues[0],
    });

    await conn.query(
      "INSERT INTO order_items (order_id, product_id, quantity, unit_price, line_total) VALUES ?",
      [itemsValues],
    );

    console.log(`[${ts()}] [${rid}] INSERT order_items OK`);

    console.log(`[${ts()}] [${rid}] COMMIT...`);
    await conn.commit();

    const ms = Date.now() - t0;
    console.log(`[${ts()}] [${rid}] COMMIT OK after ${ms}ms`);

    return { success: true, order_id: orderId, order_no: orderNo };
  } catch (e) {
    console.error(`[${ts()}] [${rid}] ERROR`, e?.message || e);
    if (conn) {
      try {
        await conn.rollback();
      } catch {}
    }
    throw e;
  } finally {
    if (conn) conn.release();
  }
}
