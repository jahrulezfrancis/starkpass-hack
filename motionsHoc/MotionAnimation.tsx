"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type MotionType =
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "fade-in"
  | "scale-in";

interface MotionAnimationProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  animation?: MotionType;
  className?: string;
}

export const MotionAnimation = ({
  children,
  delay = 0.2,
  duration = 0.5,
  animation = "slide-down", // default animation
  className,
}: MotionAnimationProps) => {
  const variants = {
    "slide-up": {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-down": {
      initial: { opacity: 0, y: -40 },
      animate: { opacity: 1, y: 0 },
    },
    "slide-left": {
      initial: { opacity: 0, x: 40 },
      animate: { opacity: 1, x: 0 },
    },
    "slide-right": {
      initial: { opacity: 0, x: -40 },
      animate: { opacity: 1, x: 0 },
    },
    "fade-in": {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
    },
    "scale-in": {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
    },
  };

  const selected = variants[animation];

  return (
    <motion.div
      initial={selected.initial}
      whileInView={selected.animate}
      transition={{ delay, duration, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.2 }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
