import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import TwintPayment from "../components/common/TwintPayment";
import { setOrderCompleted } from "../features/order/orderSlice";

const TwintPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { orderId, orderNo, amount, cartItems } = location.state || {};

  const handlePaymentSuccess = (paymentData) => {
    console.log("Zahlung erfolgreich:", paymentData);

    // Order als abgeschlossen markieren
    dispatch(setOrderCompleted(true));

    // Zur Erfolgsseite navigieren
    navigate("/checkout-success", {
      state: {
        orderId,
        orderNo,
        amount,
        paymentData,
      },
    });
  };

  const handlePaymentError = (error) => {
    console.error("Zahlungsfehler:", error);
    alert("Zahlung fehlgeschlagen. Bitte versuchen Sie es erneut.");
  };

  if (!orderId || !orderNo || !amount) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">
            Fehler beim Laden der Zahlungsseite
          </h1>
          <p className="text-gray-600 mb-4">
            Bestelldaten konnten nicht gefunden werden.
          </p>
          <button
            onClick={() => navigate("/warenkorb")}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Zurück zum Warenkorb
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            TWINT-Zahlung
          </h1>
          <p className="text-gray-600">
            Bestellung {orderNo} - CHF {amount.toFixed(2)}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* TWINT-Zahlungskomponente */}
          <div>
            <TwintPayment
              amount={amount}
              orderId={orderId}
              orderNo={orderNo}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </div>

          {/* Bestellübersicht */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Bestellübersicht</h2>
            <div className="space-y-3">
              {cartItems?.map((item) => (
                <div
                  key={item.product_id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.Bild}
                      alt={item.Name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{item.Name}</div>
                      <div className="text-sm text-gray-600">
                        Menge: {item.menge}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">
                      CHF {(item.Preis_brutto * item.menge).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Gesamtsumme:</span>
                <span>CHF {amount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/warenkorb")}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            ← Zurück zum Warenkorb
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwintPaymentPage;
