import axios from "axios";
import crypto from "crypto";

function basicAuthHeader() {
  const user = process.env.SAFERPAY_API_USERNAME;
  const pass = process.env.SAFERPAY_API_PASSWORD;
  if (!user || !pass) {
    throw new Error(" Missing SAFERPAY_API_USERNAME/SAFERPAY_API_PASSWORD");
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
        Success: `${frontend}/payment/success`,
        Fail: `${frontend}/payment/fail`,
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

    return res.json({
      redirectUrl: resp.data.RedirectUrl,
      token: resp.data.Token,
    });
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
  try {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "token is required" });

    const baseUrl =
      process.env.SAFERPAY_BASE_URL || "https://test.saferpay.com/api";

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

    return res.json({
      ok: true,
      assert: assertResp.data,
      capture: captureResp.data,
    });
  } catch (err) {
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
