import React from "react";
import { motion } from "framer-motion";

interface LoadingSkeletonProps {
  count?: number;
  variant?: "card" | "line" | "circle" | "table-row";
  className?: string;
}

export function LoadingSkeleton({
  count = 3,
  variant = "card",
  className = "",
}: LoadingSkeletonProps) {
  const variants = {
    card: "h-32 rounded-lg",
    line: "h-4 rounded w-full mb-3",
    circle: "h-12 w-12 rounded-full",
    "table-row": "h-12 rounded mb-2",
  };

  const items = Array.from({ length: count });

  return (
    <div className={className}>
      {items.map((_, i) => (
        <motion.div
          key={i}
          className={`glass ${variants[variant]} mb-3`}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
