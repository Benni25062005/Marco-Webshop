import React, { useState, useEffect } from "react";
import axios from "axios";

const TwintPayment = ({
  amount,
  orderId,
  orderNo,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [qrCode, setQrCode] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [status, setStatus] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    createTwintPayment();
  }, []);

  useEffect(() => {
    if (sessionId) {
      const interval = setInterval(checkPaymentStatus, 3000); // Alle 3 Sekunden prüfen
      return () => clearInterval(interval);
    }
  }, [sessionId]);

  const createTwintPayment = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:8800/api/twint/create-payment",
        {
          amount: amount,
          orderId: orderId,
          orderNo: orderNo,
        }
      );

      if (response.data.success) {
        setQrCode(response.data.paymentSession.qrCode);
        setSessionId(response.data.paymentSession.id);
        setStatus("pending");
      } else {
        setError("Fehler beim Erstellen der TWINT-Zahlung");
        onPaymentError("Fehler beim Erstellen der TWINT-Zahlung");
      }
    } catch (error) {
      console.error("TWINT Payment Error:", error);
      setError("Fehler beim Erstellen der TWINT-Zahlung");
      onPaymentError("Fehler beim Erstellen der TWINT-Zahlung");
    } finally {
      setLoading(false);
    }
  };

  const checkPaymentStatus = async () => {
    if (!sessionId) return;

    try {
      const response = await axios.get(
        `http://localhost:8800/api/twint/status/${sessionId}`
      );

      if (response.data.success) {
        const paymentStatus = response.data.paymentStatus.status;
        setStatus(paymentStatus);

        if (paymentStatus === "completed") {
          onPaymentSuccess({
            sessionId: sessionId,
            transactionId: response.data.paymentStatus.transactionId,
            completedAt: response.data.paymentStatus.completedAt,
          });
        } else if (paymentStatus === "failed") {
          setError("Zahlung fehlgeschlagen");
          onPaymentError("Zahlung fehlgeschlagen");
        }
      }
    } catch (error) {
      console.error("Status Check Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
        <span className="ml-2">TWINT-Zahlung wird vorbereitet...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-600 mb-4">{error}</div>
        <button
          onClick={createTwintPayment}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Erneut versuchen
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold mb-2">TWINT-Zahlung</h3>
        <p className="text-gray-600 mb-4">
          Scannen Sie den QR-Code mit Ihrer TWINT-App
        </p>
        <div className="text-lg font-bold text-red-600 mb-2">
          CHF {amount.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">Bestellung: {orderNo}</div>
      </div>

      {qrCode && (
        <div className="text-center mb-6">
          <img
            src={qrCode}
            alt="TWINT QR-Code"
            className="mx-auto border-2 border-gray-200 rounded-lg"
            style={{ maxWidth: "200px" }}
          />
        </div>
      )}

      <div className="text-center">
        {status === "pending" && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600 mr-2"></div>
            <span className="text-gray-600">Warte auf Zahlung...</span>
          </div>
        )}

        {status === "completed" && (
          <div className="text-green-600 font-semibold">
            ✅ Zahlung erfolgreich!
          </div>
        )}

        {status === "failed" && (
          <div className="text-red-600 font-semibold">
            ❌ Zahlung fehlgeschlagen
          </div>
        )}
      </div>

      <div className="mt-6 text-xs text-gray-500 text-center">
        <p>QR-Code ist 15 Minuten gültig</p>
        <p>Zahlung wird automatisch überprüft</p>
      </div>
    </div>
  );
};

export default TwintPayment;
