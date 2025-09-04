import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)",
    scale: 0.95
  },
  in: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    scale: 1
  },
  out: {
    opacity: 0,
    y: -30,
    filter: "blur(10px)",
    scale: 0.95
  }
};

const pageTransition = {
  type: "tween",
  ease: [0.25, 0.46, 0.45, 0.94],
  duration: 0.6
};

export default function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="w-full min-h-screen"
      style={{
        transformOrigin: "center",
        willChange: "transform, opacity, filter"
      }}
    >
      {children}
    </motion.div>
  );
}