import react, {useRef} from "react";
import { motion, useInView} from "framer-motion";

const cardVariant = {
    hidden: {opacity: 0, y: 30},
    visible: (customDelay) => ({ 
        opacity: 1,
        y: 0,
        transition: {
            delay: customDelay,
            duration: 0.6,
            ease: 'easeOut',
        },
    })
};

export default function BrandschutzCard({children, delay = 0}) {
    const ref = useRef();
    const isInView = useInView(ref, {
        once: true,
        margin: "-100px",
    });

    return (<>
        <motion.div
            ref={ref}
            className="bg-white shadow-md rounded-xl p-6 hover:shadow-xl transition"
            variants={cardVariant}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            custom={delay}
        >
            {children}
        </motion.div>
    
    
    
    </>)
}