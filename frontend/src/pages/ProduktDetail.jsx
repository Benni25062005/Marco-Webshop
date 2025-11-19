import React from "react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchProductById } from "../features/products/productsSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart } from "../features/cart/cartSlice.js";
import { Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Main() {
  const { id } = useParams();
  const [number, setNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const kategorie = searchParams.get("kategorie");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedItem, status } = useSelector((state) => state.products);

  const handleIncrease = () => setNumber((n) => n + 1);

  const handleDecrease = () => {
    if (number > 1) setNumber((n) => n - 1);
  };

  const HandleAddToCart = () => {
    setLoading(true);
    if (!user) {
      toast.error(
        "Bitte melden Sie sich an, um einen Artikel in den Warenkorb zu legen."
      );
      navigate("/login", { replace: true });
      return;
    }

    dispatch(
      addItemToCart({
        user_id: user.idUser,
        product: selectedItem,
        menge: number,
      })
    );
    toast.success(`Wurde zum Warenkorb hinzugefügt`);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    if (id) {
      dispatch(fetchProductById({ idProdukt: id }));
    }
    setLoading(false);
  }, [id, dispatch]);

  if (status === "loading") {
    return (
      <div className="flex justify-center pt-16">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"
          role="status"
        >
          <span className="sr-only">Lädt...</span>
        </div>
      </div>
    );
  }

  if (!selectedItem) {
    return (
      <p className="text-center mt-10 text-3xl">Feuerlöscher nicht gefunden</p>
    );
  }

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-2 mt-1 h-[2px] bg-gray-300 opacity-80 rounded-full animate-pulse" />
        </div>
      )}

      <div className="mt-10 mb-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start">
          <img
            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg border-2 border-red-600 rounded-xl p-8 sm:p-12 object-contain"
            src={selectedItem.Bild}
            alt={selectedItem.Name}
          />

          <div className="w-full lg:flex-1 max-w-xl">
            <h1 className="text-2xl sm:text-3xl font-medium">
              {selectedItem.Name}
            </h1>

            <p className="mt-3 text-2xl sm:text-3xl font-semibold text-red-600">
              <span className="text-xs sm:text-sm text-black mr-1">CHF</span>
              {Number(selectedItem.Preis_brutto).toFixed(2)}
            </p>

            <p className="mt-4 sm:mt-6 text-sm sm:text-base text-gray-500 leading-relaxed">
              {selectedItem.Beschreibung}
            </p>

            <div
              id="counter"
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-6"
            >
              <div className="inline-flex items-center justify-between gap-x-4 border border-gray-300 rounded-xl px-3 py-2 w-full sm:w-auto">
                <button onClick={handleDecrease}>
                  <Minus className="h-5 w-5" />
                </button>

                <p className="text-lg">{number}</p>

                <button onClick={handleIncrease}>
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                onClick={HandleAddToCart}
                className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md w-full sm:w-auto"
              >
                Zum Warenkorb hinzufügen
              </motion.button>
            </div>
            
            {selectedItem.Details && (
              <div className="mt-6">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between w-full border-b border-red-600 text-gray-700 font-medium py-2"
                >
                  Weitere Details
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>

                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                    className="mt-3 text-gray-600 text-sm leading-relaxed"
                  >
                    {Object.entries(selectedItem.Details).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex flex-col sm:flex-row sm:justify-between border-b py-2 text-sm gap-1"
                        >
                          {key === "Text" ? (
                            <span className="w-full text-center text-red-600 font-medium my-2">
                              {value}
                            </span>
                          ) : (
                            <>
                              <span className="font-medium sm:w-1/2">
                                {key}
                              </span>
                              <span className="sm:w-1/2 sm:text-right">
                                {value}
                              </span>
                            </>
                          )}
                        </div>
                      )
                    )}
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
