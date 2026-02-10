import React from "react";
import { useNavigate } from "react-router-dom";
import { XCircle } from "lucide-react";

export default function CheckoutFail() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-8">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex justify-center mb-6">
            <XCircle className="h-16 w-16 text-red-600" />
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Zahlung abgebrochen
          </h1>

          <p className="text-gray-600 mb-6">
            Die Zahlung wurde nicht abgeschlossen. Sie können es erneut
            versuchen.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/warenkorb")}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
            >
              Zurück zum Warenkorb
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Zurück zum Shop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
