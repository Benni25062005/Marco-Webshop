import React from "react";
import { motion } from "framer-motion";

export default function ProduktCard({ item, onClick, onAddToCart, delay = 0 }) {
  if (!item) return null;

  console.log(item);

  return (
    <motion.div
      onClick={() => onClick(item.idProdukt, item.Kategorie)}
      className="
        group flex flex-col items-center
        bg-white rounded-2xl shadow-md
        hover:shadow-xl hover:border-2 hover:border-red-600
        hover:scale-[1.02]
        transition-all duration-300
        overflow-hidden cursor-pointer
        mx-auto
        w-full max-w-xs sm:max-w-sm
        p-4 sm:p-6
      "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
    >
      {/* Bild */}
      <div className="rounded-md overflow-hidden flex items-center justify-center w-full">
        <img
          src={item.Bild}
          alt={item.Name}
          className="object-contain w-full h-56 sm:h-64"
        />
      </div>

      {/* Inhalt */}
      <div className="flex flex-col justify-between flex-grow w-full p-4">
        <div className="flex flex-col items-center">
          <h2 className="text-lg sm:text-xl font-semibold text-center">
            {item.Name}
          </h2>
          <p className="text-base sm:text-lg font-medium mt-2">
            <span className="text-gray-500 text-xs sm:text-sm align-top mr-1">
              CHF
            </span>
            {Number(item.Preis_brutto).toFixed(2)}
          </p>
        </div>

        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onAddToCart();
          }}
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ scale: 1.05 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="
            mt-4
            w-full sm:w-auto
            bg-red-600 hover:bg-red-700
            text-white font-medium
            py-2 sm:py-2.5 px-4
            rounded-md shadow-md
            opacity-100
            sm:opacity-0 sm:group-hover:opacity-100
            transition-opacity
            self-center
          "
        >
          Zum Warenkorb hinzufügen
        </motion.button>
      </div>
    </motion.div>
  );
}
