import { motion } from "framer-motion";

export default function HeroSection() {
    return (<>

    <section className="pt-44 pb-64 text-center">

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-6xl font-bold"
      >
        Kaminfeger Buchs.
      </motion.h1>

      {/* Subheadline */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-2xl md:text-3xl text-gray-500 mt-4"
      >
        Sichere Lösungen. Saubere Arbeit.
      </motion.h2>

      {/* Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-red-600 text-white px-6 py-3 rounded-full mt-6 hover:bg-red-700 transition"
      >
        Angebot anfordern
      </motion.button>
    </section>
    
    
    </>)
}