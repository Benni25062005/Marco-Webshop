import react from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const cardVariant = {
    hidden: {opacity: 0, y: 30},
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: 'easeOut',
        },
    }
};

export default function ServiceCard({ children, delay = 0}) {
    const ref = useRef(null);
    const isInView = useInView(ref, { 
        once: true,
        margin: "-100px", 
    });

    return (
        <motion.div
            ref={ref}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
            variants={cardVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={delay}
            transition={{ delay, duration: 0.6, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
}