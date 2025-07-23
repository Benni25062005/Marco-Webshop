import react from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function CartSummary({ cartItems }) {
  const handleCheckout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8800/api/payments/create-checkout-session",
        {
          items: cartItems.map((item) => ({
            price: item.stripePriceId,
            quantity: item.menge,
          })),
        }
      );
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error creating checkout session:", error);
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
