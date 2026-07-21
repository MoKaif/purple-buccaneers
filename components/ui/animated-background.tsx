"use client";

import React from "react";
import { motion } from "framer-motion";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Gradient orbs */}
      <motion.div
        className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-accent/20 to-primary/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      <motion.div
        className="absolute top-1/2 right-0 w-80 h-80 bg-gradient-to-r from-secondary/10 to-accent/10 rounded-full blur-3xl"
        animate={{
          y: [0, 100, 0],
          x: [0, 50, 0],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
