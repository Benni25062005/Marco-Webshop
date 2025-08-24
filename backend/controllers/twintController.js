import qrcode from "qrcode";
import crypto from "crypto";

export const createTwintPayment = async (req, res) => {
  try {
    const { amount, orderId, orderNo } = req.body;

    // TWINT QR-Code Daten generieren
    const twintData = {
      amount: amount,
      currency: "CHF",
      message: `Bestellung ${orderNo}`,
      reference: orderId.toString(),
      // TWINT-spezifische Parameter
      twint: {
        version: "1.0",
        type: "payment",
      },
    };

    // QR-Code für TWINT generieren
    const qrCodeData = `twint://${encodeURIComponent(
      JSON.stringify(twintData)
    )}`;
    const qrCodeImage = await qrcode.toDataURL(qrCodeData);

    // Payment Session erstellen
    const paymentSession = {
      id: crypto.randomUUID(),
      orderId: orderId,
      orderNo: orderNo,
      amount: amount,
      qrCode: qrCodeImage,
      status: "pending",
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 Minuten gültig
    };

    // Hier würden Sie die Session in der Datenbank speichern
    // await savePaymentSession(paymentSession);

    res.status(200).json({
      success: true,
      paymentSession: paymentSession,
    });
  } catch (error) {
    console.error("TWINT Payment Error:", error);
    res.status(500).json({
      success: false,
      error: "TWINT payment creation failed.",
    });
  }
};

export const checkTwintPaymentStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;

    // Hier würden Sie den Status von TWINT API abfragen
    // Für Demo-Zwecke simulieren wir eine erfolgreiche Zahlung
    const paymentStatus = {
      sessionId: sessionId,
      status: "completed", // oder 'pending', 'failed'
      transactionId: crypto.randomUUID(),
      completedAt: new Date(),
    };

    res.status(200).json({
      success: true,
      paymentStatus: paymentStatus,
    });
  } catch (error) {
    console.error("TWINT Status Check Error:", error);
    res.status(500).json({
      success: false,
      error: "TWINT status check failed.",
    });
  }
};
