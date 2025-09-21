import React from "react";
import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { fetchProductById } from "../features/products/productsSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { addItemToCart, addToCart } from "../features/cart/cartSlice.js";
import {
  Plus,
  Minus,
  ShoppingCart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function Main() {
  const { id } = useParams();
  const [number, setNumber] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const kategorie = searchParams.get("kategorie");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedItem, status } = useSelector((state) => state.products);

  const handleIncrease = (e) => {
    setNumber(number + 1);
  };

  const handleDecrease = (e) => {
    if (number == 1) {
    } else {
      setNumber(number - 1);
    }
  };

  const HandleAddToCart = (e) => {
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
    toast.success(`Wurde zum Warenkorb hinzugefügt!`);
  };

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById({ idProdukt: id }));
    }
  }, [id, dispatch]);

  if (status === "loading") {
    return (
      <div className="text-center">
        <div
          className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full text-blue-500"
          role="status"
        >
          <span className="visually-hidden">Lädt...</span>
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
      <div className="flex justify-center mt-14 gap-x-16 sm:pl-4">
        <img
          className="h-[28rem] md:h-[36rem] lg:h-[40rem] border-2 border-red-600 rounded-xl p-16 "
          src={selectedItem.Bild}
        ></img>

        <div className="max-w-2xl md:max-w-3xl lg:max-w-md ">
          <h1 className="text-3xl font-medium">{selectedItem.Name}</h1>

          {/* <p className="text-lg font-medium mt-2">
                    <span className="mr-1">CHF</span>
                    {Number(selectedItem.Preis_brutto).toFixed(2)}
                </p> */}

          <p className="text-2xl font-semibold text-red-600 mt-2">
            <span className="text-sm text-black mr-1">CHF</span>
            {Number(selectedItem.Preis_brutto).toFixed(2)}
          </p>

          <p className="mt-6 text-gray-500">{selectedItem.Beschreibung}</p>

          <div
            id="counter"
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-4"
          >
            <div className="flex items-center gap-x-4 border border-gray-300 rounded-xl px-3 py-1">
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
              className=" transition-opacity bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md self-center"
            >
              Zum Warenkorb hinzufügen
            </motion.button>
          </div>

          {selectedItem.Details && (
            <div className="mt-6">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full border-b border-red-600 text-gray-700 font-medium py-2 px-2"
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
                  className="mt-4 text-gray-600 text-sm leading-relaxed"
                >
                  {Object.entries(selectedItem.Details).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between border-b py-1 text-sm"
                    >
                      {key === "Text" ? (
                        <>
                          <span className="text-center text-red-600 font-medium my-4">
                            {value}
                          </span>
                        </>
                      ) : (
                        <>
                          <span className="font-medium">{key}</span>
                          <span>{value}</span>
                        </>
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
