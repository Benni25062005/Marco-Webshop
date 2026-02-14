import axios from "axios";
import crypto from "crypto";
import db from "../config/db.js";

function basicAuthHeader() {
  // Priorität: fertiger Header aus Backoffice
  const h = process.env.SAFERPAY_AUTH_HEADER;
  if (h && h.startsWith("Basic ")) return h;

  // Fallback: user/pass
  const user = process.env.SAFERPAY_API_USERNAME;
  const pass = process.env.SAFERPAY_API_PASSWORD;
  if (!user || !pass) {
    throw new Error("Missing SAFERPAY credentials (AUTH_HEADER or USER/PASS)");
  }
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

export const saferpayInitialize = async (req, res) => {
  try {
    const { orderId, amount, currency } = req.body;

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
        Success: `${frontend}/payment/success?token={Token}`,
        Fail: `${frontend}/payment/fail?token={Token}`,
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

    const token = resp.data?.Token;
    const redirectUrl = resp.data?.RedirectUrl;

    if (!token || !redirectUrl) {
      return res.status(500).json({
        error: "Saferpay initialize returned no token/redirectUrl",
        raw: resp.data,
      });
    }

    // ✅ DB: Token speichern + Status setzen
    await db.execute(
      `UPDATE orders
       SET saferpay_token = ?, payment_provider = 'saferpay', payment_status = 'initialized'
       WHERE order_id = ?`,
      [token, orderId],
    );

    return res.json({ redirectUrl, token });
  } catch (err) {
    console.error(
      "Saferpay Initialize Error:",
      err?.response?.data || err.message,
    );
    return res.status(500).json({
      error: "saferpay initialize failed",
      details: err?.response?.data || err.message,
    });
  }
};

export const saferpayConfirm = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "token is required" });

    const baseUrl =
      process.env.SAFERPAY_BASE_URL || "https://test.saferpay.com/api";

    // 1) Assert
    const assertResp = await axios.post(
      `${baseUrl}/Payment/v1/PaymentPage/Assert`,
      { RequestHeader: requestHeader(), Token: token },
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
      // ✅ DB: markieren als failed (optional)
      await db.execute(
        `UPDATE orders SET status='failed', payment_status='assert_failed' WHERE saferpay_token = ?`,
        [token],
      );
      return res
        .status(400)
        .json({ error: "No transaction id", raw: assertResp.data });
    }

    // 2) Capture (kann je nach Setup nötig sein)
    let captureResp = null;
    try {
      captureResp = await axios.post(
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
    } catch (e) {
      // Falls Capture nicht erlaubt ist (Sale-Flow), speichern wir trotzdem Assert-Daten.
      console.error(
        "Capture failed (maybe Sale flow):",
        e?.response?.data || e.message,
      );
    }

    // ✅ DB: Order als bezahlt setzen (wenn Capture vorhanden -> captured, sonst authorized)
    const paymentStatus = captureResp ? "captured" : "authorized";

    await db.execute(
      `UPDATE orders
       SET status = 'paid',
           payment_status = ?,
           payment_transaction_id = ?,
           paid_at = NOW()
       WHERE saferpay_token = ?`,
      [paymentStatus, transactionId, token],
    );

    return res.json({
      ok: true,
      paymentStatus,
      transactionId,
      assert: assertResp.data,
      capture: captureResp?.data ?? null,
    });
  } catch (err) {
    console.error(
      "Saferpay Confirm Error:",
      err?.response?.data || err.message,
    );
    return res.status(500).json({
      error: "saferpay confirm failed",
      details: err?.response?.data || err.message,
    });
  }
};
