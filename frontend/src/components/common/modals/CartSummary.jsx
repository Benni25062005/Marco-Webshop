import React, { useState, useEffect, useMemo } from "react";
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

  const [totalWeight, setTotalWeight] = useState(0);
  const [street, setStreet] = useState("");
  const [zip, setZip] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("CH");

  useEffect(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      setTotalWeight(0);
      return;
    }

    const weightSum = cartItems.reduce((sum, item) => {
      try {
        const rawDetails = item.Details ?? item.details;
        if (!rawDetails) return sum;

        const detailsObj =
          typeof rawDetails === "string" ? JSON.parse(rawDetails) : rawDetails;

        const gewichtStr =
          detailsObj?.Gewicht ??
          detailsObj?.gewicht ??
          detailsObj?.gewicht_kg ??
          null;

        if (!gewichtStr) return sum;

        const numeric = parseFloat(
          String(gewichtStr)
            .replace("kg", "")
            .replace("KG", "")
            .replace(/\s/g, "")
            .replace(",", "."),
        );

        if (Number.isNaN(numeric)) return sum;

        const qty = item.menge ?? item.quantity ?? 1;
        return sum + numeric * qty;
      } catch (err) {
        console.error("Fehler beim Parsen von Details für Item:", item, err);
        return sum;
      }
    }, 0);

    setTotalWeight(weightSum);
  }, [cartItems]);
  const shippingCost = useMemo(() => {
    if (totalWeight === 0) return 0;

    if (totalWeight <= 2) return 8.5;
    if (totalWeight <= 10) return 11.5;
    if (totalWeight <= 30) return 20.5;

    return 20.5;
  }, [totalWeight]);

  const itemsTotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + item.Preis_brutto * item.menge,
        0,
      ),
    [cartItems],
  );

  const grandTotal = (itemsTotal + shippingCost).toFixed(2);

  const handleCheckout = async () => {
    try {
      if (!agbAccepted) {
        setShowAgbError(true);
        return;
      }
      setShowAgbError(false);

      if (!user?.idUser) {
        toast.error("Bitte einloggen, um zu bestellen.");
        navigate("/login");
        return;
      }

      if (!street.trim() || !zip.trim() || !city.trim() || !country.trim()) {
        toast.error("Bitte Lieferadresse vollständig ausfüllen");
        return;
      }

      const orderData = {
        idUser: user.idUser,
        currency: "CHF",
        shippingCost,
        totalAmount: Number(grandTotal),
        shipping: {
          name: `${user.vorname ?? ""} ${user.nachname ?? ""}`.trim(),
          street: street.trim(),
          zip: zip.trim(),
          city: city.trim(),
          country: country.trim().toUpperCase(),
        },
        items: cartItems.map((item) => ({
          product_id: item.product_id,
          quantity: item.menge,
          unit_price: Number(item.Preis_brutto),
        })),
      };

      console.log("orderdata", orderData);

      const orderResult = await dispatch(createOrder(orderData)).unwrap();

      if (orderResult?.success !== true) {
        toast.error(orderResult?.message || "Bestellung fehlgeschlagen");
        return;
      }

      const orderId = orderResult.order_id;

      if (!orderId) {
        console.error("orderResult:", orderResult);
        toast.error("Order-ID fehlt – Backend Response prüfen");
        return;
      }

      const amount = Number(grandTotal);
      if (Number.isNaN(amount) || amount <= 0) {
        toast.error("Ungültiger Betrag.");
        return;
      }

      const initResp = await axios.post(
        `${process.env.BACKEND_URL}/api/payment/saferpay/initialize`,
        {
          orderId,
          amount,
          currency: "CHF",
        },
        { headers: { "Content-Type": "application/json" } },
      );

      const { redirectUrl } = initResp.data || {};
      if (!redirectUrl) {
        console.error("Saferpay init response:", initResp.data);
        toast.error("Saferpay konnte nicht gestartet werden.");
        return;
      }

      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Checkout Error:", error?.response?.data || error);
      toast.error("Checkout fehlgeschlagen. Bitte erneut versuchen.");
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
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">Lieferkosten</p>
              <p className="text-sm font-semibold">
                CHF {shippingCost.toFixed(2)}
              </p>
            </div>

            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">Gesamtsumme</p>
              <p className="text-xl font-semibold">CHF {grandTotal}</p>
            </div>
          </div>
        </div>

        <div className="shadow-md rounded-xl p-6">
          <h2 className="border-b pb-2 text-2xl font-semibold">
            Lieferadresse
          </h2>

          <div className="mt-4 grid gap-4">
            <div className="grid gap-1">
              <label className="text-xs font-medium text-gray-600">
                Straße & Hausnummer
              </label>
              <input
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:border outline-none transition duration-300 shadow-sm"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="grid gap-1">
                <label className="text-xs font-medium text-gray-600">
                  Postleitzahl
                </label>
                <input
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:border outline-none transition duration-300 shadow-sm"
                />
              </div>

              <div className="grid gap-1">
                <label className="text-xs font-medium text-gray-600">Ort</label>
                <input
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:border outline-none transition duration-300 shadow-sm"
                />
              </div>
            </div>

            <div className="grid gap-1">
              <label className="text-xs font-medium text-gray-600">Land</label>
              <input
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-300 focus:border-red-500 focus:border outline-none transition duration-300 shadow-sm"
              />
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
