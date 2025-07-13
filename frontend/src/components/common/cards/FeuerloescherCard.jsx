import React from "react";
import { motion } from "framer-motion";
import { FireExtinguisher  } from "lucide-react";

export default function FeuerloescherCard({ item, onClick, onAddToCart, delay = 0 }) {
    return (
        <motion.div
            onClick={() => onClick(item.idProdukt, item.Kategorie)}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:border-2 hover:border-red-600 hover:scale-105 transition-all duration-300 overflow-hidden cursor-pointer mx-auto h-[32em] w-[28em] p-4 sm:p-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, ease: "easeOut" }}
        >
            <div className="rounded-md overflow-hidden flex items-center justify-center">
                <img
                    src={item.Bild}
                    alt={item.Name}
                    className="object-contain h-[18em] w-full transition-transform"
                />
            </div>

            <div className="flex flex-col justify-between flex-grow w-full p-4 relative">
                <div className="flex flex-col items-center ">
                    <h2 className="text-xl font-semibold text-center">{item.Name}</h2>
                    <p className="text-lg font-medium mt-2">
                        <span className="text-gray-500 text-sm align-top mr-1 pl-4">CHF</span>
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
                    className="opacity-0 group-hover:opacity-100 transition-opacity mt-4 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md shadow-md self-center"
                >
                    Zum Warenkorb hinzufügen
                </motion.button>
            </div>
        </motion.div>
    );
}