import axios from "axios";
import crypto from "crypto";
import db from "../config/db.js";

function basicAuthHeader() {
  const user = process.env.SAFERPAY_API_USERNAME;
  const pass = process.env.SAFERPAY_API_PASSWORD;
  if (!user || !pass)
    throw new Error("Missing SAFERPAY_API_USERNAME/SAFERPAY_API_PASSWORD");
  return "Basic " + Buffer.from(`${user}:${pass}`).toString("base64");
}

function requestHeader() {
  const customerId = process.env.SAFERPAY_CUSTOMER_ID;
  if (!customerId) throw new Error("Missing SAFERPAY_CUSTOMER_ID");
  return {
    SpecVersion: "1.26",
    CustomerId: customerId,
    RequestId: crypto.randomUUID(),
    RetryIndicator: 0,
  };
}

const ts = () => new Date().toISOString();

export const saferpayInitialize = async (req, res) => {
  const { orderId, amount, currency } = req.body;

  try {
    if (!orderId || amount == null || !currency) {
      return res
        .status(400)
        .json({ error: "orderId, amount, currency are required" });
    }

    const baseUrl =
      process.env.SAFERPAY_BASE_URL || "https://test.saferpay.com/api";
    const terminalId = process.env.SAFERPAY_TERMINAL_ID;
    const frontend = process.env.FRONTEND_BASE_URL;

    if (!terminalId)
      return res.status(500).json({ error: "Missing SAFERPAY_TERMINAL_ID" });
    if (!frontend)
      return res.status(500).json({ error: "Missing FRONTEND_BASE_URL" });

    const body = {
      RequestHeader: requestHeader(),
      TerminalId: terminalId,
      Payment: {
        Amount: {
          Value: Math.round(Number(amount) * 100),
          CurrencyCode: currency,
        },
        OrderId: String(orderId),
        Description: `Order ${orderId}`,
      },
      ReturnUrls: {
        // wichtig: orderId mitschicken, NICHT token erwarten
        Success: `${frontend}/payment/success?orderId=${encodeURIComponent(orderId)}`,
        Fail: `${frontend}/payment/fail?orderId=${encodeURIComponent(orderId)}`,
      },
    };

    const resp = await axios.post(
      `${baseUrl}/Payment/v1/PaymentPage/Initialize`,
      body,
      {
        headers: {
          Authorization: basicAuthHeader(),
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    const redirectUrl = resp.data?.RedirectUrl;
    const token = resp.data?.Token;

    if (!redirectUrl || !token) {
      return res.status(502).json({
        error: "Saferpay initialize returned no redirectUrl/token",
        raw: resp.data,
      });
    }

    // Token in DB speichern (sonst kannst du später nicht confirm/capture)
    await db.execute(
      `UPDATE orders
       SET saferpay_token = ?, payment_provider = 'saferpay', payment_status = 'initialized'
       WHERE order_id = ?`,
      [token, orderId],
    );

    return res.json({ redirectUrl });
  } catch (err) {
    console.error(
      "Saferpay Initialize Error:",
      err?.response?.data || err.message,
    );
    return res.status(500).json({
      error: "Saferpay initialize failed",
      details: err?.response?.data || err.message,
    });
  }
};

export const saferpayConfirm = async (req, res) => {
  let conn;

  try {
    const { orderId, token } = req.body;

    if (!orderId && !token) {
      return res.status(400).json({ error: "orderId oder token ist required" });
    }

    const baseUrl =
      process.env.SAFERPAY_BASE_URL || "https://test.saferpay.com/api";

    let usedToken = token;
    let idUser = null;

    if (orderId) {
      const [rows] = await db.execute(
        "SELECT idUser, saferpay_token, payment_status FROM orders WHERE order_id = ? LIMIT 1",
        [orderId],
      );

      const order = rows?.[0];
      if (!order) {
        return res.status(404).json({ error: "Order nicht gefunden" });
      }

      idUser = order.idUser;

      if (
        order.payment_status === "paid" ||
        order.payment_status === "captured"
      ) {
        return res.json({ ok: true, alreadyPaid: true });
      }

      if (!usedToken) usedToken = order.saferpay_token;
    }

    if (!usedToken) {
      return res
        .status(400)
        .json({ error: "Kein Token vorhanden (weder Body noch DB)" });
    }

    const assertResp = await axios.post(
      `${baseUrl}/Payment/v1/PaymentPage/Assert`,
      { RequestHeader: requestHeader(), Token: usedToken },
      {
        headers: {
          Authorization: basicAuthHeader(),
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    const transactionId = assertResp.data?.Transaction?.Id;
    if (!transactionId) {
      return res
        .status(400)
        .json({ error: "No transaction id", raw: assertResp.data });
    }

    const captureResp = await axios.post(
      `${baseUrl}/Payment/v1/Transaction/Capture`,
      {
        RequestHeader: requestHeader(),
        TransactionReference: { TransactionId: transactionId },
      },
      {
        headers: {
          Authorization: basicAuthHeader(),
          "Content-Type": "application/json",
        },
        timeout: 15000,
      },
    );

    if (orderId) {
      conn = await db.getConnection();
      await conn.beginTransaction();

      await conn.execute(
        `UPDATE orders
         SET payment_status = 'paid',
             status = 'paid',
             payment_transaction_id = ?,
             paid_at = NOW()
         WHERE order_id = ?`,
        [transactionId, orderId],
      );

      if (!idUser) {
        const [urows] = await conn.execute(
          "SELECT idUser FROM orders WHERE order_id = ? LIMIT 1",
          [orderId],
        );
        idUser = urows?.[0]?.idUser ?? null;
      }

      if (idUser) {
        await conn.execute("DELETE FROM warenkorb WHERE user_id = ?", [idUser]);
      }

      await conn.commit();
      conn.release();
      conn = null;
    }

    return res.json({
      ok: true,
      transactionId,
      assert: assertResp.data,
      capture: captureResp.data,
    });
  } catch (err) {
    if (conn) {
      try {
        await conn.rollback();
      } catch {}
      try {
        conn.release();
      } catch {}
    }

    console.error(
      "Saferpay Confirm Error:",
      err?.response?.data || err.message,
    );
    return res.status(500).json({
      error: "Saferpay confirm failed",
      details: err?.response?.data || err.message,
    });
  }
};
