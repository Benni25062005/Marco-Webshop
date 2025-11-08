import react, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts } from "../features/products/productsSlice";
import { addItemToCart } from "../features/cart/cartSlice.js";
import GeneralProductCard from "../components/common/cards/GeneralProductCard.jsx";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function ProduktListe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { items, status } = useSelector((state) => state.products);
  const [loading, setLoading] = useState(false);
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState("");
  const [tempSelected, setTempSelected] = useState("");

  useEffect(() => {
    setLoading(true);
    if (items.length === 0) {
      dispatch(fetchAllProducts());
    }
    setLoading(false);
  }, [dispatch, items.length]);

  const handleClick = (id, kategorie) => {
    navigate(`/produkt/${id}?kategorie=${kategorie}`);
  };

  const handleAddToCart = (item) => {
    setLoading(true);
    if (!user) {
      toast.error("Sie müssen angemeldet sein!");
      navigate("/login");
    } else {
      dispatch(
        addItemToCart({
          user_id: user.idUser,
          product: item,
          menge: 1,
        })
      );

      toast.success("Add to cart");
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="mx-2 mt-1 h-[2px] bg-gray-300 opacity-80 rounded-full animate-pulse" />
        </div>
      )}

      {showFilter && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-24 right-8 w-[90%] sm:w-[18rem] bg-white z-50 rounded-xl shadow-2xl p-6 border border-gray-200"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Filter</h2>
            <button
              onClick={() => setShowFilter(false)}
              className="text-gray-600 hover:text-red-600 text-xl font-bold"
            >
              ×
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategorie
            </label>
            <select
              value={tempSelected}
              onChange={(e) => setTempSelected(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-red-500"
            >
              <option value="">Alle</option>
              <option value="feuerloescher">Feuerlöscher</option>
              <option value="brandschutz">Brandschutz</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSelected(tempSelected);
              setShowFilter(false);
              toast.success("Filter angewendet");
            }}
            className="w-full mt-2 text-sm bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-md transition"
          >
            Anwenden
          </button>
        </motion.div>
      )}

      <div className="flex flex-col pt-44 pb-24 text-center">
        <div className="flex flex-col space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-7xl font-bold"
          >
            Alle Produkte
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold"
          >
            auf einen Blick
          </motion.h2>
        </div>

        <div className="flex items-center justify-center space-x-6">
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => window.scrollTo({ top: 500, behavior: "smooth" })}
            className=" border border-red-600 bg-white text-black  px-6 py-3 font-bold rounded-full mt-6 hover:text-red-600 hover:shadow-md transition-all duration-300"
          >
            Entdecken
          </motion.button>
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300 }}
            onClick={() => setShowFilter(true)}
            className="bg-red-600 text-white px-6 py-3 font-bold rounded-full mt-6 hover:shadow-md transition-all duration-300"
          >
            Filter
          </motion.button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-y-24 gap-x-12 mt-24 justify-items-center px-4 sm:px-8 md:px-16 lg:px-32 xl:px-64">
        {Array.isArray(items) ? (
          items
            .filter((item) => item && item.Bild && item.Name)
            .filter((item) => !selected || item.Kategorie === selected)
            .sort((a, b) => {
              if (a.Kategorie === "feuerloescher") return -1;
              if (b.Kategorie === "feuerloescher") return 1;
              return a.Kategorie.localeCompare(b.Kategorie);
            })

            .map((item, i) => (
              <GeneralProductCard
                key={item.idProdukt}
                item={item}
                onClick={handleClick}
                onAddToCart={() => handleAddToCart(item)}
                delay={i * 0.15}
              />
            ))
        ) : (
          <p>Fehler beim Laden oder keine Produkte gefunden</p>
        )}
      </div>
    </>
  );
}
