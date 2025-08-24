import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const CheckoutSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { orderId, orderNo, amount, paymentData } = location.state || {};

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

          <p className="text-gray-600 mb-6">
            Vielen Dank für Ihre Bestellung. Ihre Zahlung wurde erfolgreich
            verarbeitet.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bestellnummer:</span>
                <span className="font-semibold">{orderNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Betrag:</span>
                <span className="font-semibold">CHF {amount?.toFixed(2)}</span>
              </div>
              {paymentData?.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaktions-ID:</span>
                  <span className="font-mono text-xs">
                    {paymentData.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/bestellungen")}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Meine Bestellungen anzeigen
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Zurück zum Shop
            </button>
          </div>

          <div className="mt-6 text-xs text-gray-500">
            <p>Sie erhalten eine Bestätigungs-E-Mail mit allen Details.</p>
            <p>Bei Fragen kontaktieren Sie uns gerne.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;
