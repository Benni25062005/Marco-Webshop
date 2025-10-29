import react, { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../../features/order/orderSlice";
import toast from "react-hot-toast";

export default function CartSummary({ cartItems }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [agbAccepted, setAgbAccepted] = useState(false);
  const [showAgbError, setShowAgbError] = useState(false);

  const handleCheckout = async () => {
    try {
      if (!agbAccepted) {
        setShowAgbError(true);
        return;
      }
      setShowAgbError(false);

      // 1. Order erstellen
      const orderData = {
        idUser: user.idUser,
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.menge,
        })),
      };

      const orderResult = await dispatch(createOrder(orderData)).unwrap();
    } catch (error) {
      console.error("Error creating order:", error);
      alert(
        "Fehler beim Erstellen der Bestellung. Bitte versuchen Sie es erneut."
      );
    }
  };

  return (
    <>
      <div className="flex flex-col gap-12 bg-white">
        <div className="shadow-md rounded-xl p-6">
          <h2 className="border-b pb-2 text-2xl font-semibold">
            Zahlungsübersicht
          </h2>
          <div className="flex flex-col justify-between space-y-2 mt-2">
            <div className="flex justify-between itemns-center">
              <p className="text-sm text-gray-500">Lieferkosten</p>
              <p className="text-sm font-semibold">CHF 30.00</p>
            </div>

            <div className="flex justify-between itemns-center">
              <p className="text-sm text-gray-500">Mehrwehrtsteuer</p>
              <p className="text-sm font-semibold">CHF 30.00</p>
            </div>

            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">Gesamtsumme</p>
              <p className="text-xl font-semibold">
                CHF{" "}
                {cartItems
                  .reduce(
                    (total, item) => total + item.Preis_brutto * item.menge,
                    0
                  )
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-12 bg-white">
          <div className="shadow-md rounded-xl p-4">
            <h2 className="border-b pb-2 text-lg font-semibold">
              Zahlungsmöglichkeiten
            </h2>

            <div className="mt-4 flex items-center gap-3">
              <input
                id="agb"
                type="checkbox"
                className="h-4 w-4 shrink-0 rounded border-gray-300"
                checked={agbAccepted}
                onChange={(e) => setAgbAccepted(e.target.checked)}
              />
              <label
                htmlFor="agb"
                className="text-sm text-gray-700 leading-none"
              >
                Ich habe die{" "}
                <a href="/agb" className="underline hover:no-underline">
                  AGB
                </a>{" "}
                gelesen und akzeptiere sie.
              </label>
            </div>

            {showAgbError && !agbAccepted && (
              <p className="mt-2 text-sm text-red-600">
                Bitte bestätige die AGB, um fortzufahren.
              </p>
            )}

            <motion.button
              className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md self-center"
              initial={{ opacity: 0, y: 0 }}
              whileHover={{ scale: 1.02 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleCheckout}
            >
              Zum Checkout
            </motion.button>
          </div>
        </div>
      </div>
    </>
  );
}
