import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";

export default function CheckoutSuccess() {
  const location = useLocation();
  const navigate = useNavigate();

  const orderId = useMemo(() => {
    const qs = new URLSearchParams(location.search);
    return qs.get("orderId");
  }, [location.search]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentData, setPaymentData] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      if (!orderId) {
        setError(
          "Kein orderId gefunden. ReturnUrl muss ?orderId=... enthalten.",
        );
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const resp = await axios.post(
          `${process.env.BACKEND_URL}/api/payment/saferpay/confirm`,
          { orderId },
          { headers: { "Content-Type": "application/json" } },
        );

        if (!cancelled) setPaymentData(resp.data);
      } catch (e) {
        if (cancelled) return;
        console.error("confirm error:", e?.response?.data || e);
        setError(
          "Zahlung konnte nicht bestätigt werden. Bitte Support kontaktieren.",
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-gray-700 font-semibold">Zahlung wird bestätigt…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <XCircle className="h-16 w-16 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Bestätigung fehlgeschlagen
            </h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => navigate("/warenkorb")}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Zurück zum Warenkorb
            </button>
          </div>
        </div>
      </div>
    );
  }

  const transactionId = paymentData?.transactionId;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Zahlung erfolgreich!
          </h1>

          {transactionId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Transaktions-ID:</span>
                <span className="font-mono text-xs">{transactionId}</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={() => navigate("/bestellungen")}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Meine Bestellungen anzeigen
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Zurück zum Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
